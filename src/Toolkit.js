export function getJSONData(retrieveURL, success, failure, debug = true) {
    fetch(retrieveURL)
        .then(response => response.json())
        .then(data => success(data))
        .catch(error => {
            failure(error);
            if (debug) throw error;
        });
}

export default class StorageManager {
    write(...keysAndValues) {
        // loop through argument key / values passed in
        for (let n=0; n<keysAndValues.length; n+=2) {
            let key = keysAndValues[n];
            let value = keysAndValues[n + 1];
            window.localStorage.setItem(key, value);    
        }
    }
    
    read(...keys) {
        let values = [];
        for (let n=0; n<keys.length; n++) {
            values.push(window.localStorage.getItem(keys[n]));
        }
        return values;
    }
}