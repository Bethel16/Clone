const colors={
    confirmed:'#ff0000' ,
    recovered: '#008000',
    death:'#373c43',
}
const caseStatus ={
    confirmed:'confirmed' ,
    recovered: 'recovered',
    death:'death',
}

 showConfirmedTotal = (total) => {
     document.querySelector('#confirmed-total').textContent = (total)
 }
 showRecoveredTotal = (total) => {
     document.querySelector('#recovered-total').textContent =(total)
 }
 showDeathTotal = (total) => {
     document.querySelector('#death-total').textContent = (total)
 }
let body = document.querySelector('body')

let countries_list 
let all_time_chart , days_chart,recovery_rate_chart

window.onload = async() =>{
    console.log('Ready...')

  
    await loadData('Global')
    await loadCountrySelectList()
    document.querySelector('#country-select-toggle').onclick = () => {
        document.querySelector('#country-select-list').classList.toggle('active')
    }
}

loadData = async (country) => {
    startLoading()
  //only init chart on page loaded first time
    await loadSummary(country)
        endLoading()
}

startLoading =() =>{
    body.classList.add('loading')
}

endLoading =() =>{
    body.classList.remove('loading')
}
isGlobal =(country) =>{
    return country === 'Global'
}
let summary , summaryData
loadSummary = async (country) => {
    summaryData= await covidApi.getSummary()
 summary = summaryData.Global
    if(!isGlobal(country)){
        summary =summaryData.Countries.map(e => e.Slug === country)[0]
    }
 showConfirmedTotal(summary.TotalConfirmed)
 showRecoveredTotal(summary.NewConfirmed)
 showDeathTotal(summary.TotalDeaths)
// Load countries table
let casesByCountries = summaryData.Countries.sort((a,b) => b.TotalConfirmed - a.TotalConfirmed)
let table_countries_body = document.querySelector('#table-countries tbody')
table_countries_body.innerHTML=''

for(let i = 0; i<10 ;i++){
    let rows =`<tr>
    <td> ${casesByCountries[i].Country}</td>
    <td> ${casesByCountries[i].TotalConfirmed}</td>
    <td> ${casesByCountries[i].NewConfirmed}</td>
    <td> ${casesByCountries[i].TotalDeaths}</td>
</tr>`

table_countries_body.innerHTML +=rows;
}

}

    renderData = (country_data) =>{
        let res = []
        country_data.forEach(e => {
            res.push(e.Cases)
        })
        return res
    }
    renderWorldData = (world_data , status) =>{
        let res = []
        world_data.forEach(e => {
            switch(status){
                case caseStatus.confirmed:
                    res.push(e.TotalConfirmed)
                    break
                    case caseStatus.recovered:
                        res.push(e.TotalRecovered)
                        break
                        case caseStatus.death:
                            res.push(e.TotalDeaths)
                            break
            }
        })
        return res
    }
renderCountrySelectList = (list) => {
    let country_select_list = document.querySelector('#country-select-list')
    country_select_list.querySelectorAll('div').forEach(e => e.remove())
    list.forEach(e => {
        let item =document.createElement('div')
        item.classList.add('country-item')
      item.textContent =e.Country


      item.onclick = async () =>{
        document.querySelector('#country-select span').textContent = e.Country
        country_select_list.classList.toggle('active')
        let selectconfirmed = e.NewConfirmed
        let Totalconfirmed = e.TotalConfirmed
        let TotalDeaths = e.TotalDeath
        document.querySelector('#confirmed-total').textContent = selectconfirmed
        document.querySelector('#recovered-total').textContent =Totalconfirmed
        document.querySelector('#death-total').textContent = TotalDeaths
      }

      country_select_list.appendChild(item)
    })
}

loadCountrySelectList = async () =>{
    let summaryData = await covidApi.getSummary()
    countries_list = summaryData.Countries
    let country_select_list = document.querySelector('#country-select-list')

    let item = document.createElement('div')
    item.classList.add('country-item')
    item.textContent ='Global'


    item.onclick = async () => {
        
        document.querySelector('#country-select span').textContent ='Global'
        country_select_list.classList.toggle('active')
        
    }
    country_select_list.appendChild(item)

    renderCountrySelectList(countries_list)
}

    fetch('https://api.covid19api.com/summary')
    .then((response) => response.json())
  .then((data) => {

 let Totalconfirmed =  data.Global.TotalConfirmed
  let NewConfirmed =  data.Global.NewConfirmed
  let TotalDeath =  data.Global.TotalDeaths

  

  Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'COVID-19 Analysis',
        align: 'left'
    },
    subtitle: {
        text: 'Source: <a ' +
            'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
            'target="_blank">Wikipedia.org</a>',
        align: 'left'
    },
    xAxis: {
        categories: ['Total Confrimed', 'Death', 'Recovered'],
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Covid (millions)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' millions'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Total Confirmed',
       data: [Totalconfirmed]
    }, {
        name: 'New Death',
        data: [NewConfirmed]
    }, {
        name: 'New Confirmed',
        data: [TotalDeath]
    }]
});

});


fetch('https://api.covid19api.com/summary')
.then((response) => response.json())
.then((data) => {

    
 let Totalconfirmed1 =  data.Global.TotalConfirmed
 let NewConfirmed1 =  data.Global.NewConfirmed
 let TotalDeath1 =  data.Global.TotalDeaths
 let NewDeath1 = data.Global.NewDeath

 // Data retrieved from https://netmarketshare.com
Highcharts.chart('container1', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Average',
        align: 'left'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Total Confirmed',
            y: Totalconfirmed1,
            sliced: true,
            selected: true
        }, {
            name: 'New Confirmed',
            y:NewConfirmed1
        }, {
            name: 'New Death',
            y:NewDeath1
        }, {
            name: 'Total Death',
            y:TotalDeath1
        }]
    }]
});

});


    

// initCountryFilter = () =>{
//     let inputdata = documnet.querySelector('#country-select-list input')
//     inputdata.onkeyup = () => {
//         let filtered = countries_list.filter(e => e.Country.toLowerCase().includes(inputdata.value))

// renderCountrySelectList(filtered)
//     }
// }





      





          