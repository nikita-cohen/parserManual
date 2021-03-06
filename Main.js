const {Worker, workerData} = require("worker_threads");
const schedule = require('node-schedule')


const data = [
    {url : "http://babycare.manualsonline.com/"},
    {url : "http://caraudio.manualsonline.com/"},
    {url : "http://cellphone.manualsonline.com/"},
    {url : "http://phone.manualsonline.com/"},
    {url : "http://office.manualsonline.com/"},
    {url : "http://fitness.manualsonline.com/"},
    {url : "http://audio.manualsonline.com/"},
    {url : "http://homeappliance.manualsonline.com/"},
    {url : "http://kitchen.manualsonline.com/"},
    {url : "http://laundry.manualsonline.com/"},
    {url : "http://lawnandgarden.manualsonline.com/"},
    {url : "http://marine.manualsonline.com/"},
    {url : "http://music.manualsonline.com/"},
    {url : "http://outdoorcooking.manualsonline.com/"},
    {url : "http://personalcare.manualsonline.com/"},
    {url : "http://camera.manualsonline.com/"},
    {url : "http://portablemedia.manualsonline.com/"},
    {url : "http://powertool.manualsonline.com/"},
    {url : "http://tv.manualsonline.com/"},
    {url : "http://videogame.manualsonline.com/"}
]

async function runWorker() {
    const result = await Promise.all(data.map((obj, index) => {
        new Promise((resolve, reject) =>  {
            const worker = new Worker('./workerThread', {
                workerData : obj
            })

            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", (code) => {
                if (code !== 0) reject(new Error("something go wrong"));
            })
        })
    }))

}

function resetAtMidnight() {
    let now = new Date();
    let night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
    );

    let msToMidnight = night.getTime() - now.getTime();

    console.log(msToMidnight)
    setTimeout(function() {
        runWorker().then();              //      <-- This is the function being called at midnight.
        resetAtMidnight();    //      Then, reset again next midnight.
    }, msToMidnight);
}

resetAtMidnight();

