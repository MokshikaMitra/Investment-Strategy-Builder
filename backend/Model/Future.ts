
var getDbConnection = require('../db/dbconnect');

import StrategyPlot from './StrategyPlot';
import IInstrumentSkeleton from './IInstrumentSkeleton';
import IInstrument from './IInstrument'
var Instrument = require('./Instrument');


export default class Future extends Instrument{
    id : number;
    quantity : number;
    instrumentSkeleton : IInstrumentSkeleton;
    instrumentSkeletonId : number;
    strategyId:number;
    side:string;
    price : number;
    plot : StrategyPlot;
    currentPrice : number;

    constructor(id:number, quantity:number, price:number, skeletonId:number, strategyId:number, side:string){
        super()
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.side = side;
        this.instrumentSkeletonId = skeletonId;
        this.strategyId = strategyId;
    }

    async setId(){

        try{
            var sql = "Select  count(*) as count from Future";

            const connection = await getDbConnection();
            var response = await connection.query(sql); 
            connection.end()
                
            this.id = response[0].count + 1;
            console.log(this.id);
        }catch(err){
            console.log(err);
            return err;
        }

    }
    
   
    async AddDataToDb(){

        if(this.id == -1){
            await this.setId();
        }
                
        var sql = "INSERT INTO Future (Id, Price, Quantity, FutureSkeletonId, InvestmentStrategyId) VALUES (?,?,?,?,?)";
       
        try{
            const connection = await getDbConnection()
            var response = await connection.query(sql, [this.id ,this.price, this.quantity, this.instrumentSkeletonId, this.strategyId]); 
            connection.end()
            return response;

        }catch(err){
            console.log(err);
            return err;
        }
    }

    
    makePlot(xStart) {
        
        if(this.side=="BUY"){

            var x = Math.floor(xStart);
            var y;

            for(var i=0;i<100;i++){

                if(x<=this.price){
                    this.plot.xCoords.push(x);
                    y = -1*this.quantity*(this.currentPrice - this.price);
                    this.plot.yCoords.push(y);
                }else{
                    this.plot.xCoords.push(x);
                    y = this.quantity*(this.currentPrice - this.price);
                    this.plot.yCoords.push(y);
                }
                x++;
            }
        }else{
            if(x<=this.price){
                this.plot.xCoords.push(x);
                y = this.quantity*(this.currentPrice - this.price);
                this.plot.yCoords.push(y);
            }else{
                this.plot.xCoords.push(x);
                y = -1*this.quantity*(this.currentPrice - this.price);
                this.plot.yCoords.push(y);
            }
            x++;
        }
        return this.plot;

    }

    getPlot(): StrategyPlot {
        return this.plot;
    }
}

module.exports = Future