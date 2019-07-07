// Monitor object array
const monitors = [];
// one monitor inch = 17px
const pxMultiplier = 17;

class Monitor {
  constructor() {
    this._id = Monitor.incrementId();
    this.size = 24;
    this.ratio = "16-9";
    this.width = null;
    this.height = null;
    this.calculate();
    this.createMonitorDiv();
    this.update();
  }

  static incrementId() {
    if (this.latestId) {
      this.latestId++;
    } else {
      this.latestId = 1;
    }
    return this.latestId;
  }

  changeSize(size) {
    this.size = size;
    this.calculate();
    this.update();
  }

  changeRatio(ratio) {
    this.ratio = ratio;
    this.calculate();
    this.update();
  }

  calculate() {
    const splitRatio = this.ratio.split("-").map(str => parseInt(str));
    this.height =
      (this.size / (1 + (splitRatio[0] / splitRatio[1]) ** 2) ** 0.5) *
      pxMultiplier;
    this.width =
      ((this.size * splitRatio[0]) /
        splitRatio[1] /
        (1 + (splitRatio[0] / splitRatio[1]) ** 2) ** 0.5) *
      pxMultiplier;
  }

  update() {
    $("#" + this._id)
      .closest(".monitor")
      .css("width", this.width);
    $("#" + this._id)
      .closest(".monitor")
      .css("height", this.height);
  }

  destroy() {
    $("#" + this._id)
      .closest(".monitor")
      .remove();
    $("#" + this._id)
      .closest("tr")
      .remove();
  }

  rotate() {
    const tempHeight = this.height;
    this.height = this.width;
    this.width = tempHeight;
    this.update();
  }

  createMonitorDiv() {
    $("#monitorArea").append(
      `<div class="monitor" id="${
        this._id
      }"><p class="monitorNumber"></p></div>`
    );
  }
}

function getMonitorId(scope) {
  return parseInt(
    $(scope)
      .closest("tr")
      .attr("id")
  );
}

function findMonitorById(monitors, id) {
  return monitors.find(monitor => monitor._id === id);
}

function attachEventListeners() {
  // Change monitor ratio
  $(".ratioSelect").change(function() {
    const id = getMonitorId(this);
    const ratio = $(this).val();
    findMonitorById(monitors, id).changeRatio(ratio);
  });

  // Change monitor size
  $("input").change(function() {
    const id = getMonitorId(this);
    const size = $(this).val();
    findMonitorById(monitors, id).changeSize(size);
  });

  // jQuery UI draggable
  $(".monitor").draggable({
    containment: "#monitorArea",
    scroll: false,
    snap: true
  });

  // Remove monitor
  $(".remove")
    .unbind()
    .on("click", function() {
      const id = getMonitorId(this);
      findMonitorById(monitors, id).destroy();
    });

  // Rotate monitor
  $(".rotate")
    .unbind()
    .on("click", function() {
      const id = getMonitorId(this);
      findMonitorById(monitors, id).rotate();
    });

  // Bring monitor forward on drag
  $(".monitor")
    .mousedown(function() {
      $(".monitor").css("z-index", "0");
      $(this).css("z-index", "1");
    })
    .mouseup(function() {
      $(this).css("z-index", "0");
    });

  // Semantic UI dropdown
  $(".ui.dropdown").dropdown();
}

function createMonitor() {
  monitors.push(new Monitor());
  const idxLastMonitor = monitors.length - 1;

  // HTML for table row with preset monitor details
  const tableRow = `<td id="dropdownCell" class="dropdownCell"><div class="ui fluid input"><input id="input" type="number" name="Diagonal" class="no-spin" value="24"></div></td>\r\n    <td class="dropdownCell">\r\n      <select class="ui fluid normal dropdown button ratioSelect"><option value="16-9">16:9</option>\r\n        <option value="16-10">16:10</option>\r\n        <option value="21-9">21:9</option>\r\n        <option value="4-3">4:3</option>\r\n      </select>\r\n    </td>\r\n    <td class="rotate"><i class="large redo alternate icon"></i>Rotate</td>\r\n    <td class="remove"><i class="large times icon"></i>Remove</td>\r\n  </tr>`;

  $("#table").append(
    `<tr id=${monitors[idxLastMonitor]._id}
      >\r\n    <td class="rowId">${
        monitors[idxLastMonitor]._id
      }</td>\r\n${tableRow}`
  );
  $(".monitor:last")
    .css("left", `${40 + monitors[idxLastMonitor]._id}%`)
    .css("top", `${14 + monitors[idxLastMonitor]._id}%`);
  $(".monitor p:last").text(monitors[idxLastMonitor]._id);
  attachEventListeners();
}

// Create monitor
$(".sideButton").on("click", function() {
  createMonitor();
});

// create initial monitor
createMonitor();
