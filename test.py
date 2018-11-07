import random
words = ['apple','banana','watermelon','kiwl','pineapple','mango']
wordIndex = random.randint (0,len(word)-1)
secretWird = word[wordIndex]

blanks = '_'*len(secretWird)

print(''' the answer is ''' )
