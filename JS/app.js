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


// numberWithCommas = (x) =>{
//     return x.toString().replace(/\B(?=(\d{3}) + (?!\d))/g , "," )
//  }
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
    await initCountryFilter()
    await initAllTimeChart()
    await initDaysChart()
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
    await loadAllTimeChart(country)
    await loadDaysChart(country)
 
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
loadSummary = async (country) => {
    let summaryData= await covidApi.getSummary()
    let summary = summaryData.Global
    if(!isGlobal(country)){
        summary =summaryData.Countries.map(e => e.Slug === country)[0]
    }
 showConfirmedTotal(summary.TotalConfirmed)
 showRecoveredTotal(summary.TotalRecovered)
 showDeathTotal(summary.TotalDeaths)
// Load countries table
let casesByCountries = summaryData.Countries.sort((a,b) => b.TotalConfirmed - a.TotalConfirmed)
let table_countries_body = document.querySelector('#table-countries tbody')
table_countries_body.innerHTML=''

for(let i = 0; i<10 ;i++){
    let rows =` <tr>
    <td> ${casesByCountries[i].Country}</td>
    <td> ${casesByCountries[i].TotalConfirmed}</td>
    <td> ${casesByCountries[i].TotalRecovered}</td>
    <td> ${casesByCountries[i].TotalDeaths}</td>
</tr>`

table_countries_body.innerHTML +=rows;
}

}
initAllTimeChart = async() =>{
    let options ={
        chart:{
            type:'line'
        },
        colors:[colors.confirmed,colors.recovered,colors.death],
        series:[],
        xaxis:{
            catagories:[],
            lables:{
                show:false
            }
        },
        grid:{
            show:false
        },
        stroke:{
            curve:'smooth'
        }
    }
    all_time_chart = new ApexCharts(document.querySelector('#all-time-chart'),options)
    all_time_chart.render()
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




    loadAllTimeChart = async (country) =>{
        let lables = []
        let confirm_data , recovered_data ,deaths_data
        if(isGlobal(country)){
                        let world_data = await covidApi.getWorldDaysCases()
                        world_data.sort((a,b) => new Date (a.Date) - new Date(b.Date))
                        world_data.forEach(e => {
                            let d = new Date(e.Date)
                            lables.push(`${d.getFullYear()} -${d.getMonth()+1} - ${d.getDate()}`)
                        })
                        confirm_data = renderWorldData(world_data,caseStatus.confirmed)
                        recovered_data = renderWorldData(world_data,caseStatus.recovered)
                        deaths_data = renderWorldData(world_data , caseStatus.death)
                    }  else{
                        let confirmed = await covidApi.getCountryAllTimeCases(country , caseStatus.confirmed)
                        let recovered = await covidApi.getCountryAllTimeCases(country , caseStatus.recovered)
                        let deaths = await covidApi.getCountryAllTimeCases(country , caseStatus.death)
            
                        confirm_data = renderData(confirmed)
                        recovered_data = renderData(recovered)
                        deaths_data = renderData(deaths)
            
                        confirmed.forEach(e => {
                            let d = new Date(e.Date)
                            lables.push(`${d.getFullYear()} - ${d.getMonth()+1} -${d.getDate()}`)
                        })
            
                    }
                    let series = [{
                        name:'Confirmed',
                        data: confirm_data
                    },{
                        name: 'Recovered' ,
                        data: recovered_data
                    },{
                        name: 'Death' ,
                        data: deaths_data
                    }]

                    all_time_chart.updateOptions({
                        series:series,
                        xaxis:{
                            catagories:lables
                        }
                    })
    }

       initDaysChart = async () => {
        let options ={
            chart:{
                type:'line'
            },
            colors:[colors.confirmed,colors.recovered,colors.death],
            series:[],
            xaxis:{
                catagories:[],
                lables:{
                    show:false
                }
            },
            grid:{
                show:false
            },
            stroke:{
                curve:'smooth'
            }
        }
       days_chart = new ApexCharts(document.querySelector('#days-chart'),options)
       days_chart.render()
       }


loadDaysChart = async (country) =>{
    let lables = []
    let confirm_data , recovered_data ,deaths_data
    if(isGlobal(country)){
                    let world_data = await covidApi.getWorldAllTimeCases()
                    world_data.sort((a,b) => new Date(a.Date) - new Date(b.Date))
                    world_data.forEach(e => {
                        let d = new Date(e.Date)
                        lables.push(`${d.getFullYear()} -${d.getMonth()+1} - ${d.getDate()}`)
                    })
                    confirm_data = renderWorldData(world_data,caseStatus.confirmed)
                    recovered_data = renderWorldData(world_data,caseStatus.recovered)
                    deaths_data = renderWorldData(world_data , caseStatus.death)
                }  else{
                    let confirmed = await covidApi.getCountryDaysCases(country , caseStatus.confirmed)
                    let recovered = await covidApi.getCountryDaysCases(country , caseStatus.recovered)
                    let deaths = await covidApi.getCountryDaysCases(country , caseStatus.death)
        
                    confirm_data = renderData(confirmed)
                    recovered_data = renderData(recovered)
                    deaths_data = renderData(deaths)
        
                    confirmed.forEach(e => {
                        let d = new Date(e.Date)
                        lables.push(`${d.getFullYear()} - ${d.getMonth()+1} -${d.getDate()}`)
                    })
        
                }
                let series = [{
                    name:'Confirmed',
                    data: confirm_data
                },{
                    name: 'Recovered' ,
                    data: recovered_data
                },{
                    name: 'Death' ,
                    data: deaths_data
                }]

                days_chart.updateOptions({
                    series:series,
                    xaxis:{
                        catagories:lables
                    }
                })

}


// // initRecoverRate = async () =>{
// //     let options ={
// //         chart:{
// //             type:'radialBar',
// //             heigth:'350'
// //         },
// //         series:[],
// //         lables:['Recovery rate'],
// //         colors:[colors.recovered]   
// //     }
// //    }

// loadRecoveryRate = async (rate)=> {
//     recovery_rate_chart.updateSeries([rate])
// }



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
        await loadData(e.Slug)
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
        await loadData('Global')
    }
    country_select_list.appendChild(item)

    renderCountrySelectList(countries_list)
}


initCountryFilter = () =>{
    let input = document.querySelector('#country-select-list input')
    input.onkeyup = () =>{
        let filtered = countries_list.filter(e => e.Country.toLowerCase().includes(input.value))
        renderCountrySelectList(filtered)
    }
}