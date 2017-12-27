version=0.2

all: doc site content download

doc:
	mkdir -p documentation
	max2html --style source/css/style.css --out documentation/purejavascript source/mt/purejavascript/*.txt

site:
	quasi -f . source/mt/*.txt

content:
	libexec/tools/generate_content.sh  share/content/_index                article  source/mt/purejavascript/1-Introduction.txt
	libexec/tools/generate_content.sh  share/content/source                article  source/mt/purejavascript/2-Source.txt
	libexec/tools/generate_content.sh  share/content/source                aside    source/mt/purejavascript/2.1-Outline.txt
	libexec/tools/generate_content.sh  share/content/source-api_server     article  source/mt/purejavascript/*-APIServer.txt
	libexec/tools/generate_content.sh  share/content/source-auth           article  source/mt/purejavascript/*-Auth.txt
	libexec/tools/generate_content.sh  share/content/source-base64         article  source/mt/purejavascript/*-Base64.txt
	libexec/tools/generate_content.sh  share/content/source-call           article  source/mt/purejavascript/*-Call.txt
	libexec/tools/generate_content.sh  share/content/source-class          article  source/mt/purejavascript/*-Class.txt
	libexec/tools/generate_content.sh  share/content/source-cookie         article  source/mt/purejavascript/*-Cookie.txt
	libexec/tools/generate_content.sh  share/content/source-csv_file       article  source/mt/purejavascript/*-CSV_file.txt
	libexec/tools/generate_content.sh  share/content/source-date           article  source/mt/purejavascript/*-Date.txt
	libexec/tools/generate_content.sh  share/content/source-datalist       article  source/mt/purejavascript/*-Datalist.txt
	libexec/tools/generate_content.sh  share/content/source-data_storage   article  source/mt/purejavascript/*-DataStorage.txt
	libexec/tools/generate_content.sh  share/content/source-element        article  source/mt/purejavascript/*-Element.txt
	libexec/tools/generate_content.sh  share/content/source-enum           article  source/mt/purejavascript/*-Enum.txt
	libexec/tools/generate_content.sh  share/content/source-form           article  source/mt/purejavascript/*-Form.txt
	libexec/tools/generate_content.sh  share/content/source-geocode        article  source/mt/purejavascript/*-Geocode.txt
	libexec/tools/generate_content.sh  share/content/source-helper         article  source/mt/purejavascript/*-Helper.txt
	libexec/tools/generate_content.sh  share/content/source-html_entities  article  source/mt/purejavascript/*-HTML_entities.txt
	libexec/tools/generate_content.sh  share/content/source-input_file     article  source/mt/purejavascript/*-Input_file.txt
	libexec/tools/generate_content.sh  share/content/source-is             article  source/mt/purejavascript/*-Is.txt
	libexec/tools/generate_content.sh  share/content/source-links          article  source/mt/purejavascript/*-Links.txt
	libexec/tools/generate_content.sh  share/content/source-load           article  source/mt/purejavascript/*-Load.txt
	libexec/tools/generate_content.sh  share/content/source-location       article  source/mt/purejavascript/*-Location.txt
	libexec/tools/generate_content.sh  share/content/source-modal          article  source/mt/purejavascript/*-Modal.txt
	libexec/tools/generate_content.sh  share/content/source-session        article  source/mt/purejavascript/*-Session.txt
	libexec/tools/generate_content.sh  share/content/source-selects        article  source/mt/purejavascript/*-Selects.txt
	libexec/tools/generate_content.sh  share/content/source-setup          article  source/mt/purejavascript/*-Setup.txt
	libexec/tools/generate_content.sh  share/content/source-string         article  source/mt/purejavascript/*-String.txt

download:
	mkdir -p archive/js/purejavascript
	mkdir -p share/resources/downloads
	cat `find share/js -name "*.js"` > archive/js/purejavascript/purejavascript-$(version).js
	cp -f archive/js/purejavascript/*.js share/resources/downloads

clean:
	rm -rf share
