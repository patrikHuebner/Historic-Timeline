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
        let nodesArray = [];
        this.nodes = new DataSet(nodesArray);

        // create an array with edges
        let edgesArray = [];
        this.edges = new DataSet(edgesArray);

        // create a network
        var container = document.getElementById("networkGraph");
        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };

        var options = {
            interaction: {
                hover: true,
            },
            edges: {
                width: 0.5,
                color: { inherit: "from" },
                smooth: {
                    type: "continuous",
                },
            },
            // edges: {
            //     smooth: false
            // },
            layout: {
                hierarchical: {
                    enabled: true,
                    // nodeSpacing: 425,
                    blockShifting: false,
                    edgeMinimization: true,
                    sortMethod: "directed"
                }
            }
        }


        // CREATE NETWOR
        this.network = new Network(container, this.data, options);


        // LIMIT ZOOMING
        var afterzoomlimit = {
            scale: 0.49,
        }
        let that = this;
        this.network.on("zoom", function () { //while zooming 
            if (that.network.getScale() <= 0.49)//the limit you want to stop at
            {
                that.network.moveTo(afterzoomlimit); //set this limit so it stops zooming out here
            }
        });
    }



    createNetworkVisualization(ID) {
        let groupHover = function (values, id, selected, hovering) {
            values.width = 3;
            values.toArrow = true;
        };
        let keywordHover = function (values, id, selected, hovering) {
            values.width = 3;
            values.fromArrow = true;
        };
        let locationHover = function (values, id, selected, hovering) {
            values.width = 3;
            values.fromArrow = true;
        };
        let primaryObjectHover = function (values, id, selected, hovering) {
            values.width = 3;
        };

        let nodeHover = function (values, id, selected, hovering) {
            values.borderWidth = 3;
        };
        

        let elements = [];
        let nodesArray = [];
        let edgesArray = [];

        let indexID = 1;

        // -- PRIMARY ELEMENT
        let focusItem = this.timelineApp.items.get(ID);
        nodesArray.push({ id: indexID, label: focusItem.Was, itemID: ID, shape: 'diamond', chosen: { label: true, node: nodeHover } });
        elements.push(ID);
        indexID++;

        // -- CONNECT GROUP
        nodesArray.push({ id: indexID, label: focusItem.Gruppe, shape: 'circle', chosen: { label: true, node: nodeHover } });
        edgesArray.push({ from: 1, to: indexID, chosen: { label: true, edge: primaryObjectHover } });
        let primaryGroupID = indexID;
        indexID++;


        // -- CONNECT ALL ELEMENTS OF THE SAME GROUP
        // Retrieve all items with the above className
        let sameClassNameItems = this.timelineApp.items.get({
            filter: function (item) {
                //return items from timeline matching query
                return item.className === focusItem.className;
            }
        });
        // Add those objects to the array
        for (let i = 0; i < sameClassNameItems.length; i++) {
            if (sameClassNameItems[i].Was != focusItem.Was) {
                elements.push(sameClassNameItems[i].id);
                nodesArray.push({ id: indexID, label: sameClassNameItems[i].Was, itemID: sameClassNameItems[i].id, shape: 'box', chosen: { label: true, node: nodeHover } });
                edgesArray.push({ from: primaryGroupID, to: indexID, chosen: { label: true, edge: groupHover } });
                indexID++;
            }
        }



        // -- CONNECT TO LOCATIONS
        let locations = [];
        for (let i = 0; i < nodesArray.length; i++) {
            let thisElement = this.timelineApp.items.get(nodesArray[i].itemID);

            if (thisElement.Wo != undefined) {
                if (locations.indexOf(thisElement.Wo) === -1) {
                    // Add location
                    locations.push(thisElement.Wo);
                    nodesArray.push({ id: indexID, label: thisElement.Wo, shape: 'box', chosen: { label: true, node: nodeHover } });
                    edgesArray.push({ from: nodesArray[i].id, to: indexID, chosen: { label: true, edge: locationHover } });
                    indexID++;
                } else {
                    // Locaton was already added
                    edgesArray.push({ from: nodesArray[i].id, to: nodesArray.find(x => x.label === thisElement.Wo).id, chosen: { label: true, edge: locationHover } });
                }
            }
        }



        // -- CONNECT TO KEYWORDS
        let keywords = [];
        for (let i = 0; i < nodesArray.length; i++) {
            let thisElement = this.timelineApp.items.get(nodesArray[i].itemID);
            if (thisElement.id != undefined) {
                if (thisElement.keywords != undefined) {
                    let keywordList = thisElement.keywords.split(',');
                    for (let j = 0; j < keywordList.length; j++) {
                        if (keywords.indexOf(keywordList[j]) === -1) {
                            // Add keyword
                            keywords.push(keywordList[j]);

                            // Add connections
                            nodesArray.push({ id: indexID, label: keywordList[j], shape: 'circle', chosen: { label: true, node: nodeHover } });
                            edgesArray.push({ from: nodesArray[i].id, to: indexID, chosen: { label: true, edge: keywordHover } });
                            indexID++;
                        } else {
                            // Keyword was already added
                            edgesArray.push({ from: nodesArray[i].id, to: nodesArray.find(x => x.label === keywordList[j]).id, chosen: { label: true, edge: keywordHover } });
                        }
                    }
                }
            }
        }





        // Update and re-draw
        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(nodesArray);
        this.edges.add(edgesArray);

        var fitOption = {
            nodes: this.nodes.getIds() //nodes is type of vis.DataSet contains all the nodes
        }
        this.network.fit(fitOption);
    }


}