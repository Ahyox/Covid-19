# Covid-19 NGN

This is a web monitoring tool and it allow you get updates based on local government, affected countries and safety informations needed to combat the virus.

## Tech / Resources Used

* Html
* Javascript
* Firebase Database
* [API Endpoint](https://rapidapi.com/Gramzivi/api/covid-19-data?endpoint=apiendpoint_3b206a11-7e2c-43e1-ad1a-dc8d7bbf4662)


## Installation
Follow this [step](https://firebase.google.com/docs/hosting/?authuser=0#implementation_path) to install firebase cli on your PC


## Steps
* To start you will need to have a [firebase](https://firebase.google.com/) account.
* Create database from firebase. For this project I created two nodes **states** and **lga** you can update this to your own functionality 
* Open the project file in a terminal and run the following:

1. If you've not login to firebase before you will need to run this code
```bash
firebase login
```

2. To initialize a new Firebase project, run the following command from within your app's directory and follow the prompts:
```bash
firebase init
```

3. If everything looks fine then you can upload to firebase. Use the following command
```bash
firebase deploy
```
#### PS:

> Since this is done with just pure html and javascript you can enhance it for other framework of your choice, you can also make use of other database other than nosql

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)