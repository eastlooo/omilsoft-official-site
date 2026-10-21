"""Static deployment checks. Run with python3 tests/site-check.py (no packages)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://eastlooo.github.io/omilsoft-official-site/'
PAGES = ['index.html', 'en/index.html', 'tadak/index.html',
         'en/tadak/index.html', 'operator-info.html', 'en/operator-info.html']
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}


class Element:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def find(self, tag=None, **attrs):
        matches = []
        for child in self.children:
            if isinstance(child, Element):
                if (tag is None or child.tag == tag) and all(
                        child.attrs.get(k) == v for k, v in attrs.items()):
                    matches.append(child)
                matches += child.find(tag, **attrs)
        return matches

    def text(self):
        return ''.join(c.text() if isinstance(c, Element) else c for c in self.children)


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Element()
        self.stack = [self.root]
        self.feed(source)
        assert len(self.stack) == 1, 'Unclosed HTML elements'

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        assert self.stack[-1].tag == tag, f'Mismatched closing tag: {tag}'
        self.stack.pop()

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def check():
    docs = {name: Document((ROOT / name).read_text()).root for name in PAGES}
    titles, descriptions, canonicals = set(), set(), set()
    for name, doc in docs.items():
        lang = doc.find('html')[0].attrs['lang']
        assert lang == ('en' if name.startswith('en/') else 'ko')
        title = doc.find('title')[0].text()
        description = doc.find('meta', name='description')[0].attrs['content']
        assert 0 < len(title) <= 60 and title not in titles, name
        assert 0 < len(description) <= 155 and description not in descriptions, name
        titles.add(title)
        descriptions.add(description)
        canonical = doc.find('link', rel='canonical')[0].attrs['href']
        assert canonical.startswith(BASE) and canonical not in canonicals, name
        canonicals.add(canonical)
        assert len(doc.find('h1')) == len(doc.find('main')) == 1, name
        ids = [el.attrs['id'] for el in doc.find() if 'id' in el.attrs]
        assert len(ids) == len(set(ids)), name
        alternates = {x.attrs['hreflang']: x.attrs['href'] for x in
                      doc.find('link', rel='alternate')}
        assert set(alternates) == {'ko', 'en', 'x-default'}, name
        assert alternates['x-default'] == alternates['ko'], name
        for alternate_lang in ['ko', 'en']:
            target_url = alternates[alternate_lang]
            target_path = target_url.removeprefix(BASE)
            target_name = target_path + 'index.html' if target_path.endswith('/') or not target_path else target_path
            target_doc = docs[target_name]
            assert target_doc.find('html')[0].attrs['lang'] == alternate_lang
            reciprocal = {x.attrs['hreflang']: x.attrs['href'] for x in
                          target_doc.find('link', rel='alternate')}
            assert reciprocal == alternates, name
        for prop in ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height']:
            assert doc.find('meta', property=prop), (name, prop)
        assert doc.find('meta', property='og:url')[0].attrs['content'] == canonical
        assert doc.find('meta', name='twitter:card')[0].attrs['content'] == 'summary_large_image'
        assert doc.find('link', rel='apple-touch-icon')
        if name in ['index.html', 'en/index.html']:
            assert len(doc.find('meta', name='google-site-verification')) == 2
        graph = json.loads(doc.find('script', type='application/ld+json')[0].text())['@graph']
        types = {x['@type']: x for x in graph}
        assert 'Organization' in types and 'WebSite' in types
        if 'tadak/' in name:
            faqs = [(x.find('summary')[0].text().strip(), x.find('p')[0].text().strip())
                    for x in doc.find('details')]
            data = [(x['name'], x['acceptedAnswer']['text']) for x in types['FAQPage']['mainEntity']]
            assert faqs == data and 6 <= len(faqs) <= 8, name
            rating = types['MobileApplication']['aggregateRating']
            assert rating['ratingValue'] == '4.6' and rating['ratingCount'] == 2057
            assert '4.6' in doc.text() and '2,057' in doc.text()
        if 'operator-info' in name:
            assert 'BreadcrumbList' in types
            assert '766-11-02666' in doc.text()
            assert '010-4316-1505' in doc.text()
        footer_links = [x.attrs.get('href', '') for x in doc.find('footer')[0].find('a')]
        for policy in ['privacy', 'terms', 'support', 'account-deletion', 'community-policy']:
            assert any('tadak-legal/' in u and u.endswith(policy + '.html') for u in footer_links)
        for image in doc.find('img'):
            assert all(key in image.attrs for key in ['alt', 'width', 'height']), name
            assert int(image.attrs['width']) > 0 and int(image.attrs['height']) > 0
        for el in doc.find():
            for attr in ['href', 'src', 'srcset']:
                value = el.attrs.get(attr)
                if not value:
                    continue
                url = urlsplit(value)
                if url.scheme or url.netloc:
                    continue
                target = (ROOT / name).parent / unquote(url.path) if url.path else ROOT / name
                if target.is_dir():
                    target /= 'index.html'
                assert target.exists(), (name, value)
                if url.fragment and target.suffix == '.html':
                    target_doc = docs.get(str(target.relative_to(ROOT))) or Document(target.read_text()).root
                    assert target_doc.find(id=url.fragment), (name, value)
        print(f'PASS {name}: metadata, languages, structure, assets, links, policies')
    xml = ET.parse(ROOT / 'sitemap.xml').getroot()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'x': 'http://www.w3.org/1999/xhtml'}
    assert {x.text for x in xml.findall('s:url/s:loc', ns)} == canonicals
    for url in xml.findall('s:url', ns):
        assert url.find('s:lastmod', ns).text == '2026-10-21'
        assert len(url.findall('x:link', ns)) == 3
    assert BASE + 'sitemap.xml' in (ROOT / 'robots.txt').read_text()
    print('PASS sitemap.xml / robots.txt: all six canonical URLs and language pairs')


if __name__ == '__main__':
    check()
