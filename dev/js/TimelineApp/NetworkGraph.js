import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { DataSet, Network } from 'vis-network/standalone';

export default class NetworkGraph {

    constructor(app, timelineApp) {
        this.app = app;
        this.timelineApp = timelineApp;
        this.init();
    }



    // ---------------------------------------------------------------------------------------------
    // GLOBAL
    // ---------------------------------------------------------------------------------------------


    init() {
        this.createNetworkGraph();
    }


    update() {
    }


    resize() {
    }





    // ---------------------------------------------------------------------------------------------
    // CLASS-SPECIFIC FUNCTIONS
    // ---------------------------------------------------------------------------------------------


    createNetworkGraph() {
        // create an array with nodes
        var nodes = new DataSet([
            { id: 1, label: "Node 1" },
            { id: 2, label: "Node 2" },
            { id: 3, label: "Node 3" },
            { id: 4, label: "Node 4" },
            { id: 5, label: "Node 5" },
        ]);

        // create an array with edges
        var edges = new DataSet([
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 1, to: 4 },
            { from: 1, to: 5 },
        ]);

        // create a network
        var container = document.getElementById("networkGraph");
        var data = {
            nodes: nodes,
            edges: edges,
        };
        var options = {};

        var network = new Network(container, data, options);



        var afterzoomlimit = { //here we are setting the zoom limit to move to 
            scale: 0.49,
        }
        network.on("zoom", function () { //while zooming 
            if (network.getScale() <= 0.49)//the limit you want to stop at
            {
                network.moveTo(afterzoomlimit); //set this limit so it stops zooming out here
            }
        });
    }


}