import axios from "axios";
import {
    CONST
} from './const';
const url = CONST.CONST_URL.concat('/clothes/');

class clothesApi {
    static getWeatherDetails(city, state, country) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(`${url}get_weather`, {
                    city, state, country
                }, {
                  withCredentials: true
                });
                resolve(res.data);
              } catch (err) {
                reject(err);
              }
        });
    }
}

export default clothesApi;