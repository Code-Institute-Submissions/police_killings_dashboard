queue()
    .defer(d3.csv, "data/police_killings.csv")
    .await(makeGraphs);

function makeGraphs(error, police_killings) {

    var ndx = crossfilter(police_killings);
    
    show_gender_balance(ndx);
    number_of_people_killed(ndx, "Male", "#number_of_men_killed");
    number_of_people_killed(ndx, "Female", "#number_of_women_killed");
    total_people_killed(ndx, "#total_people_killed");
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

    






