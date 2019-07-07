const monitors = []; // Monitor object array
let i = 0;
const pxMultiplier = 17;

class Monitor {
  constructor() {
    this._id = Monitor.incrementId();
    this.size = 24;
    this.ratio = "16-9";
    this.width = null;
    this.height = null;
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
    // console.log("calculating");
    const splitRatio = this.ratio.split("-").map(str => parseInt(str));
    const height =
      (this.size / (1 + (splitRatio[0] / splitRatio[1]) ** 2) ** 0.5) *
      pxMultiplier;
    const width =
      ((this.size * splitRatio[0]) /
        splitRatio[1] /
        (1 + (splitRatio[0] / splitRatio[1]) ** 2) ** 0.5) *
      pxMultiplier;

    this.width = width;
    this.height = height;
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
}

function getId(scope) {
  return $(scope)
    .closest("tr")
    .attr("id");
}

// Create monitor
$(".sideButton").on("click", function() {
  i++;
  monitors[i] = new Monitor();
  $("#monitorArea").append(
    `<div class="monitor" id="${
      monitors[i]._id
    }"><p class="monitorNumber"></p></div>`
  );
  const table = `<td id="dropdownCell" class="dropdownCell"><div class="ui fluid input"><input id="input" type="number" name="Diagonal" class="no-spin" value="24"></div></td>\r\n    <td class="dropdownCell">\r\n      <select class="ui fluid normal dropdown button ratioSelect"><option value="16-9">16:9</option>\r\n        <option value="16-10">16:10</option>\r\n        <option value="21-9">21:9</option>\r\n        <option value="4-3">4:3</option>\r\n      </select>\r\n    </td>\r\n    <td class="rotate"><i class="large redo alternate icon"></i>Rotate</td>\r\n    <td class="remove"><i class="large times icon"></i>Remove</td>\r\n  </tr>`;

  monitors[i].calculate();

  monitors[i].update(i);
  $("#table").append(
    "<tr id=" +
      monitors[i]._id +
      '>\r\n    <td class="rowId">' +
      monitors[i]._id +
      "</td>\r\n" +
      table
  );
  $(".monitor:last")
    .css("left", 40 + monitors[i]._id + "%")
    .css("top", 14 + monitors[i]._id + "%");
  $(".monitor p:last").text(monitors[i]._id);
  attachEventListeners();
});

function attachEventListeners() {
  $(".ratioSelect").change(function() {
    const id = getId(this);
    monitors[id].changeRatio($(this).val());
  });

  $("input").change(function() {
    const id = getId(this);
    monitors[id].changeSize($(this).val());
  });

  // jQuery UI draggable
  $(".monitor").draggable({
    containment: "#monitorArea",
    scroll: false,
    snap: true
  });

  // Remove monitor
  $(".remove").on("click", function() {
    const id = getId(this);
    monitors[id].destroy();
  });

  // Rotate monitor
  $(".rotate")
    .unbind()
    .on("click", function() {
      const id = getId(this);
      monitors[id].rotate();
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

// Triger click to create first monitor
$(".sideButton").trigger("click");
