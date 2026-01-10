//get value from fron htnl input
const userInput = document.getElementById('pokeName')
//event listner on button calls the function get fetch whne click is activated
document.getElementById('btn').addEventListener('click', getFetch)

//whne thr button is cliked the function below activates
function getFetch() {
    //varaible to store user input and pass into the url below 
    const choice = userInput.value.replaceAll(' ','-').replaceAll(' ','.').toLowerCase()
    // console.log(choice)
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`
    //searches jason file for a match with user input

    fetch(url)
        .then(res => res.json())
        .then(data => {
            //console.log(data)

            //access json by dot nototaion 
            const newPoke = new PokeInfo( //!note change here
                data.name,
                data.height,
                data.weight,
                data.types,
                data.sprites.other['official-artwork'].front_default,
                data.location_area_encounters
            )
            //! and this
            newPoke.getTypes()
            newPoke.isHousePet()
            newPoke.encounterInfo()

            let decision = ''
            if (newPoke.housePet) {
                decision = `This is a good housepet as it's small enough at ${newPoke.h} and weighs ${newPoke.w}`
            } else {
                decision = `not a good housepet because ${newPoke.reason.join(' and ')}`
            }
            //DisplayInDOom
            document.querySelector('h2').innerText = newPoke.name
            document.querySelector('img').src = newPoke.image
            document.querySelector('h3').innerText = newPoke.typeList
            document.querySelector('h4').innerText = decision
            //document.querySelector('h4').innerText = newPoke.typeList.join(', ')
            //TODO document.querySelector('.location').innerText = 
        })
}

//empty constructor pass in json dayt from above
class Poke {
    constructor(name, height, weight, types, image) {
        this.name = name
        this.h = height
        this.w = weight
        this.types = types
        this.image = image
        this.housePet = true
        this.reason = []
        this.typeList = []
        //console.log(this.reason)
    }

    //> loop through all types charastaristic of pokemon
    getTypes() {
        for (const property of this.types) {
            this.typeList.push(property.type.name)
        }
        //console.log(this.typeList)
    }
    //!can call methods below when we need
    weightToPounds(num) {
        return Math.round((num / 4.526) * 100) / 100
    }

    heightToFeet(height) {
        return Math.round((height / 3.048) * 100) / 100
    }

    isHousePet() {
        //check height weight tupe and height, if criteria fails shoud = false due to bad types
        const badTypes = ['fire', 'ghost', 'electric', 'poison','flying','electric']
        
            if(badTypes.some(r => this.typeList.indexOf(r) >= 0)){            
                this.reason.push(` due to being a ${this.typeList} type`)
                this.housePet = false;
            }

        if (this.weightToPounds(this.w) > 400) {
            this.housePet = false;
            this.reason.push(`it is too heavy at ${this.w}'lbs'`)
        }
        if (this.heightToFeet(this.h) > 2) {
            this.reason.push(` is too tall at ${this.h}cm`)
            this.housePet = false
        }

        
    }
}

//Extenstion and Inheritance add additonal functioanlty to our poke class this is a common method as to not wmess working code above, the extend methods adds further functionalityby pulling the informatio from the code above below to further mannilnalte
//! reyuires the key words super and extend

class PokeInfo extends Poke{
    constructor(name, height, weight, types, image,location){
        super(name,height,weight,types,image); //inhreit propeties frmo above
        this.locationURL = location; //store information to maniuplate and store in location list
        this.locationList = [] //empty area to push after formatting
        this.locationString = '' //to push in to dom
    }
        //new method //! need to invoke thast why it didnt work whne you rushed ahead!!!
        //!need to extend from parent class
        encounterInfo(){
            fetch(this.locationURL)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                for(const item of data){
                    this.locationList.push(item.location_area.name)
                }
                console.log(this.locationList)
                console.log(this.locationCleanUp())
            })
        }

        locationCleanUp() {
            //?slice takes intow params start(0) and end(5)
            const words = this.locationList
            .slice(0,5)
            .join('-')
            .split('-')

            // words.forEach(e => {
            //     console.log(e[0].toUpperCase() + e.slice(1))
            
            // })

            for(let i = 0; i <words.length;i++){
                const capL = words[i][0].toUpperCase()
                const add = capL + capL[i].slice(1)
            }

            return words

        }

    }
