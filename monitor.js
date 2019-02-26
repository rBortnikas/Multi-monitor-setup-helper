var obj = []; //Monitor object store
var i = 0;
const pxMultiplier = 17;

class Monitor {
  constructor() {
    this._id = Monitor.incrementId();
    this.size = 24;
    this.ratio = "16-9";
  }

  static incrementId() {
    if (!this.latestId) {
      this.latestId = 1;
    } else {
      this.latestId++;
    }
    return this.latestId;
  }

  calculate(size) {
    var splitRatio = this.ratio.split("-");
    var height =
      (size / (1 + (splitRatio[0] / splitRatio[1]) ** 2) ** 0.5) * pxMultiplier;
    var width =
      ((size * splitRatio[0]) /
        splitRatio[1] /
        (1 + (splitRatio[0] / splitRatio[1]) ** 2) ** 0.5) *
      pxMultiplier;

    return { height: height, width: width };
  }

  update(id) {
    $("#" + this._id)
      .closest(".monitor")
      .css("width", this.width);
    $("#" + this._id)
      .closest(".monitor")
      .css("height", this.height);
  }

  destroy(id) {
    $("#" + id)
      .closest(".monitor")
      .remove();
    $("#" + id)
      .closest("tr")
      .remove();
  }

  rotate(id) {
    console.log(obj[id]);
    var height = obj[id].width;
    var width = obj[id].height;
    obj[id].height = height;
    obj[id].width = width;
  }
}

//Create monitor
$(".sideButton").on("click", function() {
  i++;
  obj[i] = new Monitor();
  console.log("Monitor object created: " + i);
  $("#monitorArea").append(
    '<div class="monitor" id="' +
      obj[i]._id +
      '"><p class="monitorNumber"></p></div>'
  );
  var table =
    '<td id="dropdownCell" class="dropdownCell"><div class="ui fluid input"><input id="input" type="number" name="Diagonal" class="no-spin" value="24"></div></td>\r\n    <td class="dropdownCell">\r\n      <select class="ui fluid normal dropdown button ratioSelect"><option value="16-9">16:9</option>\r\n        <option value="16-10">16:10</option>\r\n        <option value="21-9">21:9</option>\r\n        <option value="4-3">4:3</option>\r\n      </select>\r\n    </td>\r\n    <td class="rotate"><i class="large redo alternate icon"></i>Rotate</td>\r\n    <td class="remove"><i class="large times icon"></i>Remove</td>\r\n  </tr>';

  obj[i].height = obj[i].calculate(obj[i].size, obj[i].ratio).height;
  obj[i].width = obj[i].calculate(obj[i].size, obj[i].ratio).width;
  obj[i].update(i);
  $("#table").append(
    "<tr id=" +
      obj[i]._id +
      '>\r\n    <td class="rowId">' +
      obj[i]._id +
      "</td>\r\n" +
      table
  );
  $(".monitor:last")
    .css("left", 40 + obj[i]._id + "%")
    .css("top", 14 + obj[i]._id + "%");
  $(".monitor p:last").text(obj[i]._id);
  events();
});

//triger click to create first monitor
$(".sideButton").trigger("click");

function events() {
  $(".ratioSelect").change(function() {
    var id = $(this)
      .closest("tr")
      .attr("id");
    obj[id].ratio = $(this).val();
    obj[id].height = obj[id].calculate(obj[id].size, obj[id].ratio).height;
    obj[id].width = obj[id].calculate(obj[id].size, obj[id].ratio).width;
    obj[id].update(id);
  });

  $("input").change(function() {
    var id = $(this)
      .closest("tr")
      .attr("id");
    obj[id].size = $(this).val();
    obj[id].height = obj[id].calculate(obj[id].size, obj[id].ratio).height;
    obj[id].width = obj[id].calculate(obj[id].size, obj[id].ratio).width;
    obj[id].update(id);
  });

  $(function() {
    $(".monitor").draggable({
      containment: "#monitorArea",
      scroll: false,
      snap: true
    });
  });

  //remove monitor
  $(".remove").on("click", function() {
    var id = $(this)
      .closest("tr")
      .attr("id");
    obj[id].destroy(id);
  });

  //Rotate monitor
  $(".rotate")
    .unbind()
    .on("click", function() {
      var id = $(this)
        .closest("tr")
        .attr("id");
      obj[id].rotate(id);
      obj[id].update(id);
      console.log("rotated");
    });

  //Bring monitor forward on drag
  $(".monitor")
    .mousedown(function() {
      $(".monitor").css("z-index", "0");
      $(this).css("z-index", "1");
    })
    .mouseup(function() {
      $(this).css("z-index", "0");
    });

  //Semantic UI dropdown
  $(".ui.dropdown").dropdown();
}
