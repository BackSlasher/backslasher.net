.PHONY: push

push:
	cat file-list | xargs -I {} scp {} backslasher.net:./backslasher.net/{}

pull:
	cat file-list | xargs -I {} scp backslasher.net:./backslasher.net/{} {}

