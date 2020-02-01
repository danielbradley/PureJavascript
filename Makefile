version=2.k

.PHONY: archive

default:
	echo "make dev | release | public"

dev:     quasi           dev_proxy     dev_copy

release: quasi artifacts release_proxy copy

public:
	rsync --delete -avz _content _resources ../../_Public/com.purejavascript

dev_copy:
	mkdir -p _resources/downloads
	cp -f  archive/js/purejavascript/purejavascript-$(version)-dev.js _resources/downloads
	cp -f  archive/js/purejavascript/purejavascript-latest-dev.js     _resources/downloads

copy:
	mkdir -p _resources/downloads
	cp -f  archive/js/purejavascript/*.js _resources/downloads
	cp -rf share/resources/thirdparty _resources

release_proxy: archive/js/purejavascript/purejavascript-$(version).js

archive/js/purejavascript/purejavascript-$(version).js:
	mkdir -p archive/js/purejavascript
	cat `find -s _gen/js -name "*.js"` > archive/js/purejavascript/purejavascript-$(version).js
	cp -f archive/js/purejavascript/purejavascript-$(version).js archive/js/purejavascript/purejavascript-latest.js

dev_proxy:
	mkdir -p archive/js/purejavascript
	cat `find -s _gen/js -name "*.js"` > archive/js/purejavascript/purejavascript-$(version)-dev.js
	cp -f archive/js/purejavascript/purejavascript-$(version)-dev.js archive/js/purejavascript/purejavascript-latest-dev.js

artifacts: doc content

doc:
	mkdir -p _documentation
	max2html --style source/css/style.css --out _documentation/purejavascript source/mt/*.txt

quasi:
	echo "/* PureJavascript version $(version) */" > _gen/js/AAA.js
	quasi -f . source/mt/*.txt

content:
	libexec/tools/generate_content.sh  _content/source                article  source/mt/2-Source.txt
	libexec/tools/generate_content.sh  _content/source                aside    source/mt/2.1-Outline.txt
	libexec/tools/generate_content.sh  _content/source-api_server     article  source/mt/*-APIServer.txt
	libexec/tools/generate_content.sh  _content/source-auth           article  source/mt/*-Auth.txt
	libexec/tools/generate_content.sh  _content/source-base64         article  source/mt/*-Base64.txt
	libexec/tools/generate_content.sh  _content/source-call           article  source/mt/*-Call.txt
	libexec/tools/generate_content.sh  _content/source-class          article  source/mt/*-Class.txt
	libexec/tools/generate_content.sh  _content/source-cookie         article  source/mt/*-Cookie.txt
	libexec/tools/generate_content.sh  _content/source-csv_file       article  source/mt/*-CSV_file.txt
	libexec/tools/generate_content.sh  _content/source-date           article  source/mt/*-Date.txt
	libexec/tools/generate_content.sh  _content/source-datalist       article  source/mt/*-Datalist.txt
	libexec/tools/generate_content.sh  _content/source-data_storage   article  source/mt/*-DataStorage.txt
	libexec/tools/generate_content.sh  _content/source-element        article  source/mt/*-Element.txt
	libexec/tools/generate_content.sh  _content/source-enum           article  source/mt/*-Enum.txt
	libexec/tools/generate_content.sh  _content/source-filter         article  source/mt/*-Filter.txt
	libexec/tools/generate_content.sh  _content/source-forms          article  source/mt/*-Forms.txt
	libexec/tools/generate_content.sh  _content/source-geocode        article  source/mt/*-Geocode.txt
	libexec/tools/generate_content.sh  _content/source-helper         article  source/mt/*-Helper.txt
	libexec/tools/generate_content.sh  _content/source-html_entities  article  source/mt/*-HTML_entities.txt
	libexec/tools/generate_content.sh  _content/source-input_file     article  source/mt/*-Input_file.txt
	libexec/tools/generate_content.sh  _content/source-is             article  source/mt/*-Is.txt
	libexec/tools/generate_content.sh  _content/source-links          article  source/mt/*-Links.txt
	libexec/tools/generate_content.sh  _content/source-load           article  source/mt/*-Load.txt
	libexec/tools/generate_content.sh  _content/source-location       article  source/mt/*-Location.txt
	libexec/tools/generate_content.sh  _content/source-modal          article  source/mt/*-Modal.txt
	libexec/tools/generate_content.sh  _content/source-session        article  source/mt/*-Session.txt
	libexec/tools/generate_content.sh  _content/source-selects        article  source/mt/*-Selects.txt
	libexec/tools/generate_content.sh  _content/source-setup          article  source/mt/*-Setup.txt
	libexec/tools/generate_content.sh  _content/source-string         article  source/mt/*-String.txt

clean:
	rm -rf _documentation
	rm -rf _gen
	rm -rf _resources
	rm -rf _content
