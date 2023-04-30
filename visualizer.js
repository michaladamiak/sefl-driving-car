class Visualizer{
    static drawNetwork(ctx, network){
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width-margin*2;
        const height = ctx.canvas.height-margin*2;

        const levelHeight = height/network.levels.length;

        for(let i=network.levels.length-1;i>=0;i--){
            const levelTop = top + lerp(height-levelHeight,0,network.levels.length==1?0.5:i/(network.levels.length-1));
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i==network.levels.length-1?[" ↑","←","→"," ↓"]:[]);
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels){
        const right = left + width;
        const bottom = top + height;

        const {inputs, outputs, weights, biases} = level;

        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 3;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.setLineDash([10,2]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        const nodeRadius = 20;
        for(let i=0;i<inputs.length;i++){
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.fill();
        }
        for(let i=0;i<outputs.length;i++){
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.stroke();

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAligh = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius*0.8)+"px Arial";
                ctx.fillText(outputLabels[i],x-nodeRadius*0.4,top);
                ctx.lineWidth=1;
                ctx.strokeText(outputLabels[i],x-nodeRadius*0.4,top);
            }
        }
    }

    static #getNodeX(nodes, index, left, right){
        return lerp(left, right, nodes.length==1?0.5:index/(nodes.length-1));
    }
}