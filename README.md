### Stream Two Dashboard Project

### Live link : https://police-killings-dashboard.herokuapp.com/

#### Built with :

* Flask
* Python
* HTML5
* CSS3
* Bootstrap3
* MongoDB Database
* JavaScript Libraries
  * d3.js
  * dc.js
  * crossfilter.js
  * queue.js
* A dataset in the format of a .csv file

#### Components :

##### Flask

A Python micro-framework that was used to serve the data and render the HTML pages for this Application.

##### Python

A Python file name threatened_species.py renders a graphs.html template and builds a web server using pymongo to interact with MongoDB.

##### MongoDB Database

NoSQL database that converts and presents data in JSON format. The dataset resource was downloaded as a csv file. It had many different rows of data, some rows that were not needed, so I developed a little Python script to clean the data and create a new .csv file that only contains the rows of data that I wanted to present with the graphs.

```python
import csv
with open("data/police_killings.csv","r") as source:
    rdr= csv.reader( source )
    with open("data/updated_csv_file.csv","w") as result:
        wtr= csv.writer( result )
        for r in rdr:
            wtr.writerow( (r[0], r[1], r[2], r[3], r[9], r[19], r[31]) )
```

This script was created so I could dramaticly reduce the size of the .csv file so the data transfer over the wire would be alot faster.

##### Queue.js

An asynchronour helper library for JavaScript.

##### Crosfilter.js

A Javascript based data manipulation library that enables two way data binding. This means that when one graph is clicked on the rest of the graphs will filter to represent the data corectly.

##### D3.js

A JavaScript based visualisation engine that renders interactive charts and graphs in svg format when given data, which are then passed in to divs in graphs.html

##### D3.js

A Javascript based wrapper library for d3.js which made plotting the charts easier.

#### Deployment and Hosting

This Application was deployed and is hosted on Heroku - gunicorn Python package runs the http server for the app, the Procfile gives Heroku the information to run the app and requirements.txt is a file that conains all the Python packages (pip installs) required to run the app. mLab MongoDB was chosen to host the dataset on the server.

#### Testing

This Application was tested across a range of browsers






