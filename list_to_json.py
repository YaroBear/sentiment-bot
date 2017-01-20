#Takes the tab seperated AFINN text file and converts it to JSON
import json

def main():
	afinn = dict()
	with open('C:/Users/yaro/Desktop/twitterBot/AFINN/AFINN-111.txt', 'r') as f_in,\
	 open('C:/Users/yaro/Desktop/twitterBot/AFINN.json', 'w') as f_out:
		for line in f_in:
			word, value = line.split('\t')
			afinn.update({word: int(value.replace('\n', ''))})
		json.dump(afinn, f_out)

if __name__ == '__main__':
	main()