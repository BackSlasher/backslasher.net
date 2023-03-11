.PHONY: docs/cv.pdf serve

docs/cv.pdf:
	./fetch-cv.sh docs/cv.pdf

serve:
	cd docs && python -m http.server
