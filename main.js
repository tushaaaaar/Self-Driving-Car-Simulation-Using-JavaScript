const carCanvas=document.getElementById("carCanvas");
carCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=500;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}


const traffic=[
    // new Car(road.getLaneCenter(1), 0, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(0), -200, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(2), -200, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(0), -500, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(1), -500, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(2), -800, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(1), -800, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(0), -1000, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(2), -1000, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(0), -1200, 45, 70, "DUMMY", 2),
    // new Car(road.getLaneCenter(1), -1200, 45, 70, "DUMMY", 2)
];

for(let i=0;i<50;i++){
    const x = Math.floor(Math.random()*3);
    const y = Math.floor(Math.random()*3);
    console.log(x);
    if (x==y){
        const c = new Car(road.getLaneCenter(x),-(0+300*i),45,70,"DUMMY", 2);
        traffic.push(c);
    }
    else{
        const c = new Car(road.getLaneCenter(x),-(0+300*i),45,70,"DUMMY", 2);
        const d = new Car(road.getLaneCenter(y),-(0+300*i),45,70,"DUMMY", 2);
        traffic.push(c);
        traffic.push(d);
    }
    
}

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    console.log("Progress Saved!");
}

function discard(){
    localStorage.removeItem("bestBrain");
}


function generateCars(N){
    const cars=[];
    for (let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),300,45,70,"AI"))
    }
    return cars;
}

function animate(time){ 
// console.log(bestCar.y);
    for (let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }
    for (let i=0;i<cars.length;i++){
        cars[i].update(road.borders, traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.8);

    road.draw(carCtx);
    
    for (let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "red");
    }
    
    carCtx.globalAlpha=0.2;
    for (let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue",true);

    carCtx.restore();

    requestAnimationFrame(animate);
}