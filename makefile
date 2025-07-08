.PHONY: docs/cv.pdf serve

docs/cv.pdf:
	rclone copyto 'drive:work/new job/Resume.pdf' docs/cv.pdf --drive-export-formats pdf

serve:
	cd docs && python -m http.server
