import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default class UI {

    constructor(timelineApp) {
        this.timelineApp = timelineApp;
        this.init();
    }



    // ---------------------------------------------------------------------------------------------
    // GLOBAL
    // ---------------------------------------------------------------------------------------------


    init() {
        this.attachZoomHandler();
    }


    update() {
    }


    resize() {
    }





    // ---------------------------------------------------------------------------------------------
    // CLASS-SPECIFIC FUNCTIONS
    // ---------------------------------------------------------------------------------------------


    attachZoomHandler() {
        let that = this;
        document.getElementById('zoomIn').onclick = function () { that.timelineApp.timeline.zoomIn(.5); };
        document.getElementById('zoomOut').onclick = function () { that.timelineApp.timeline.zoomOut(.5); };

        tippy('#zoomIn', {
            content: 'Klicken Sie auf dieses Symbol um den visualisierten Zeitraum des Zeitstrahles zu verkleinern.<p/><i>Hinweis &rarr;</i> Sie können auch das Mausrad nutzen um den dargestellten Zeitraum frei einzustellen.',
            placement: "right",
            delay: [0, 0],
        });
        tippy('#zoomOut', {
            content: 'Klicken Sie auf dieses Symbol um den visualisierten Zeitraum des Zeitstrahles zu vergößern.<p/><i>Hinweis &rarr;</i> Sie können auch das Mausrad nutzen um den dargestellten Zeitraum frei einzustellen.',
            placement: "right",
            delay: [0, 0],
        });

    }

}