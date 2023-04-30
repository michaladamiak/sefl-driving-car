const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N=400;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.15);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -150,30,50,"DUMMY",1.5),
    new Car(road.getLaneCenter(2), -300,30,50,"DUMMY",2.5)
    // new Car(road.getLaneCenter(1), -400,30,50,"DUMMY",2),
    // new Car(road.getLaneCenter(0), -350,30,50,"DUMMY",1.5),
    // new Car(road.getLaneCenter(2), -300,30,50,"DUMMY",2.5),
    // new Car(road.getLaneCenter(0), -600,30,50,"DUMMY",2.5),
    // new Car(road.getLaneCenter(2), -600,30,50,"DUMMY",2.5)
];
let passedCars = 0;

animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for(let i=0;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function addNewTraffic(){
    traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random()*3)),bestCar.y-500,30,50,"DUMMY",Math.random()*3));
}

setInterval(addNewTraffic, 4000);

function animate(time) {
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);
    carCtx.restore();

    //tutaj dodać sprawdzanie ile aut było minietych i dodać count / najlepsze auto to to z najwiekszym countem
    // for(let i=0;i<traffic.length;i++){
    //     for(j = 0; j<N;)
    //     if(traffic[i].y == bestCar)
    // }

    networkCtx.lineDashOffset=-time/90;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}