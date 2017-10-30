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
    dc.renderAll();
}
    
    
function show_gender_balance(ndx) {
    
    var gender_dim = ndx.dimension(dc.pluck('raceethnicity'));
    var count_by_gender = gender_dim.group();
    
    dc.barChart("#killings_by_gender")
        .height(300)
        .width(800)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(gender_dim)
        .group(count_by_gender)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
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
        .formatNumber(d3.format())
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
        return [d.age, d.pov, d.raceethnicity, d.gender, d.name, d.state];
    });
    var povGroup = experienceDim.group();

    var minAge = eDim.bottom(1)[0].age;
    var maxAge = eDim.top(1)[0].age;

    dc.scatterPlot("#pov_killing")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minAge,maxAge]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("Pov")
        .xAxisLabel("Age")
        .title(function (d) {
            return d.key[4] + " , " + d.key[0] + " , " + d.key[5] + " , " + d.key[3] + " , " + d.key[2];
        })
        .colorAccessor(function (d) {
            return d.key[3];
        })
        .colors(genderColors)
        .dimension(experienceDim)
        .group(povGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
}

function age_of_people_killed(ndx) {
    var age_dim = ndx.dimension(dc.pluck('age'));
    var count_by_age = age_dim.group().reduce(
        function (p, v) {
            if (v.age <= 20) {
                p.count++;
            }
            else if (v.age <= 30) {
                p.count++;
            }
            else if (v.age <= 40) {
                p.count++;
            }
            else if (v.age <= 50) {
                p.count++;
            }
            else if (v.age <= 60) {
                p.count++;
            }
            else if (v.age <= 70) {
                p.count++;
            }
            else if (v.age <= 80) {
                p.count++;
            }
            else if (v.age <= 90) {
                p.count++;
            }
            else if (v.age <= 100) {
                p.count++;
            }
            else
                return 0;
            return p;
        },
        function (p, v) {
            if (v.age <= 20) {
                p.count--;
            }
            else if (v.age <= 30) {
                p.count--;
            }
            else if (v.age <= 40) {
                p.count--;
            }
            else if (v.age <= 50) {
                p.count--;
            }
            else if (v.age <= 60) {
                p.count--;
            }
            else if (v.age <= 70) {
                p.count--;
            }
            else if (v.age <= 80) {
                p.count--;
            }
            else if (v.age <= 90) {
                p.count--;
            }
            else if (v.age <= 100) {
                p.count--;
            }
            else
                return 0;
            return p;
        },
        function () {
            return {count: 0};
        }
    );

    dc.barChart("#killings_by_age")
        .height(300)
        .width(800)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(age_dim)
        .group(count_by_age)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Age")
        .yAxis().ticks(4);          
}



    






