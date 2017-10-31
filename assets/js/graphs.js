queue()
    .defer(d3.csv, "data/police_killings.csv")
    .await(makeGraphs);

function makeGraphs(error, police_killings) {

    var ndx = crossfilter(police_killings);
    
    police_killings.forEach(function(d){
        d.pov = parseInt(d.pov);
        d.age = parseInt(d.age);
    });
    
    show_gender_balance(ndx);
    number_of_people_killed(ndx, "Male", "#number_of_men_killed");
    number_of_people_killed(ndx, "Female", "#number_of_women_killed");
    total_people_killed(ndx, "#total_people_killed");
    show_poverty_to_killing_correlation(ndx);
    age_of_people_killed(ndx);
    show_cause_of_death(ndx)
    dc.renderAll();
}
    
    
function show_gender_balance(ndx) {
    
    var gender_dim = ndx.dimension(dc.pluck('raceethnicity'));
    var count_by_gender = gender_dim.group();
    
    dc.barChart("#killings_by_gender")
        .height(300)
        .width(800)
        // .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(gender_dim)
        .group(count_by_gender)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
        .yAxisLabel("No of People")
        .yAxis().ticks(4);            
}

function number_of_people_killed(ndx, gender, element) {
    var number_killed = ndx.groupAll().reduce(
        function (p, v) {
            if (v.gender === gender) {
                p.count++;
            }
            return p;
        },
        function (p, v) {
            if (v.gender === gender) {
                p.count--;
            }
            return p;
        },
        function () {
            return {count: 0};
        }
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format(".0f"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.count);
            }
        })
        .group(number_killed);
}

function total_people_killed(ndx, element) {
     var number_killed = ndx.groupAll().reduceCount().value();
     
     document.getElementById("total_people_killed").innerHTML = number_killed;
     
}

function show_poverty_to_killing_correlation(ndx) {
    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["pink", "blue"]);

    var eDim = ndx.dimension(dc.pluck("age"));
    var experienceDim = ndx.dimension(function(d){
        return [d.age, d.pov, d.raceethnicity, d.gender, d.name, d.state, d.cause];
    });
    var povGroup = experienceDim.group();

    var minAge = eDim.bottom(1)[0].age;
    var maxAge = eDim.top(1)[0].age;

    dc.scatterPlot("#pov_killing")
        .width(600)
        .height(300)
        .x(d3.scale.linear().domain([minAge,maxAge]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("Pov Rate Areas")
        .xAxisLabel("Age")
        .title(function (d) {
            return d.key[4] + " , " + d.key[0] + " , " + d.key[6] + " , " + d.key[5] + " , " + d.key[3] + " , " + d.key[2];
        })
        .colorAccessor(function (d) {
            return d.key[3];
        })
        .colors(genderColors)
        .dimension(experienceDim)
        .group(povGroup)
        // .margins({top: 10, right: 50, bottom: 30, left: 50});
}

function age_of_people_killed(ndx) {
    
    var a_dim = ndx.dimension(dc.pluck('age'));
    var age_dim = ndx.dimension(function(d){
            if (d.age < 20) {
                return "10's";
            }
            else if (d.age < 30) {
                return "20's";
            }
            else if (d.age < 40) {
                return "30's";
            }
            else if (d.age < 50) {
                return "40's";
            }
            else if (d.age < 60) {
                return "50's";
            }
            else if (d.age < 70) {
                return "60's";
            }
            else if (d.age < 80) {
                return "70's";
            }
            else if (d.age < 90) {
                return "80's";
            }
            else if (d.age < 100) {
                return "90's";
            }
            else
                return 0;
        
        
        

    });
    var count_by_age = age_dim.group();


    var minAge = a_dim.bottom(1)[0].age;
    var maxAge = a_dim.top(1)[0].age;
    
    dc.barChart("#killings_by_age")
        .height(300)
        .width(600)
        // .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(age_dim)
        .group(count_by_age)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Age")
        .yAxisLabel("No of People")
        .yAxis().ticks(4);            
}

function show_cause_of_death(ndx) {
    var causeDim = ndx.dimension(dc.pluck("cause"));
    var causeSelect = causeDim.group();

    dc.selectMenu("#cause_of_death")
        .dimension(causeDim)
        .group(causeSelect);
}



    






