import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            lines = []
            for p in tree.findall('.//w:p', namespace):
                texts = [node.text for node in p.findall('.//w:t', namespace) if node.text]
                if texts:
                    lines.append(''.join(texts))
            return '\n'.join(lines)
    except Exception as e:
        return str(e)

print(extract_text_from_docx("/Users/zeandycontrolflowlabs.com/Downloads/MVP Draft.docx"))
