const pt = require('puppeteer');
const axios = require('axios');
const {Worker, parentPort, workerData} = require("worker_threads");

const data = workerData;

async function parseData(url) {
    const obj = {};
    const browser = await pt.launch();
    const page = await browser.newPage();

    const newUrl = url;

    try {
        await page.goto(newUrl, {timeout: 0});

        const href = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(`h5.seeprices-header > a`))
                .map(x => {
                    return {"href": x.href, "text": x.textContent}
                });
        })

        for (let i = 0; i < href.length; i++) {
            await page.goto(href[i].href, {timeout: 0});

            const categoryArray = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(`#middle-wrapper > div > div.col-sm-8.col-md-8 > h1`))
                    .map(x => {
                        return {"text": x.textContent}
                    });
            })

            obj.category = categoryArray[0];

            const elementArray = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(`h5.seeprices-header > a`))
                    .map(x => {
                        return {"href": x.href, "text": x.textContent}
                    });
            })
            //div.col-md-8.col-sm-8.col-xs-7 > h5 > a
            for (let i = 0; i < elementArray.length; i++) {
                await page.goto(elementArray[i].href, {timeout: 0});

                const elementArray2 = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(`div.col-md-8.col-sm-8.col-xs-7 > h5 > a`))
                        .map(x => {
                            return {"href": x.href, "text": x.textContent}
                        });
                })

                elementArray2.forEach((x, index) => {
                    obj.url = x.href;
                    obj.title = x.text;

                    axios.post("https://search.findmanual.guru/manual/online/", obj)
                        .then(data => console.log("ok " + index))
                        .catch(e => console.log(e));
                })
            }

        }
        await browser.close();
    } catch (e) {

    }

}

parseData(data.url).then()
