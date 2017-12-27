version=0.2

all: doc site content download

doc:
	mkdir -p documentation
	max2html --style source/css/style.css --out documentation/purejavascript source/mt/purejavascript/*.txt

site:
	quasi -f . source/mt/purejavascript/*.txt

content:
	libexec/tools/generate_content.sh  share/content/purejavascript/_index                article  source/mt/purejavascript/1-Introduction.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source                article  source/mt/purejavascript/2-Source.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source                aside    source/mt/purejavascript/2.1-Outline.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-api_server     article  source/mt/purejavascript/*-APIServer.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-auth           article  source/mt/purejavascript/*-Auth.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-base64         article  source/mt/purejavascript/*-Base64.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-call           article  source/mt/purejavascript/*-Call.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-class          article  source/mt/purejavascript/*-Class.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-cookie         article  source/mt/purejavascript/*-Cookie.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-csv_file       article  source/mt/purejavascript/*-CSV_file.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-date           article  source/mt/purejavascript/*-Date.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-datalist       article  source/mt/purejavascript/*-Datalist.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-data_storage   article  source/mt/purejavascript/*-DataStorage.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-element        article  source/mt/purejavascript/*-Element.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-enum           article  source/mt/purejavascript/*-Enum.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-form           article  source/mt/purejavascript/*-Form.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-geocode        article  source/mt/purejavascript/*-Geocode.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-helper         article  source/mt/purejavascript/*-Helper.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-html_entities  article  source/mt/purejavascript/*-HTML_entities.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-input_file     article  source/mt/purejavascript/*-Input_file.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-is             article  source/mt/purejavascript/*-Is.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-links          article  source/mt/purejavascript/*-Links.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-load           article  source/mt/purejavascript/*-Load.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-location       article  source/mt/purejavascript/*-Location.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-modal          article  source/mt/purejavascript/*-Modal.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-session        article  source/mt/purejavascript/*-Session.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-selects        article  source/mt/purejavascript/*-Selects.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-setup          article  source/mt/purejavascript/*-Setup.txt
	libexec/tools/generate_content.sh  share/content/purejavascript/source-string         article  source/mt/purejavascript/*-String.txt

download:
	mkdir -p archive/js/purejavascript
	mkdir -p share/content/purejavascript/_resources/downloads
	cat `find share/content/purejavascript/_resources/javascript -name "*.js"` > archive/js/purejavascript/purejavascript-$(version).js
	cp -f archive/js/purejavascript/*.js share/content/purejavascript/_resources/downloads

local: clean all
	rm -rf ~/Documents/Dropbox/Dropspace-Sites/purejavascript.local/*
	rsync -avz share/content/purejavascript/* ~/Documents/Dropbox/Dropspace-Sites/purejavascript.local

release: all
	rm -rf ~/Documents/Dropbox/Dropspace-Sites/purejavascript/*
	rsync -avz share/content/purejavascript/* ~/Documents/Dropbox/Dropspace-Sites/purejavascript

clean:
	rm -rf share/content/purejavascript/*
