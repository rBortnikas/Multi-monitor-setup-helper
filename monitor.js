var obj = []; //Monitor object store
var i = 0;
const pxMultiplier = 17;

class Monitor {
  constructor() {
    this._id = Monitor.incrementId()
    this.size = 24;
    this.ratio = "16-9";
  }

  static incrementId() {
      if (!this.latestId){
        this.latestId = 1;
      } else {
        this.latestId++;
      }
      return this.latestId;
    };

    calculate(size, ratio) {
      // let height = 10;
      let splitRatio = this.ratio.split("-");
      // console.log(splitRatio);
      // console.log("0 -- " + splitRatio[0]);
      // console.log("0 -- " + splitRatio[1]);
      let height = (size/((1+(splitRatio[0]/splitRatio[1])**2)**0.5))*pxMultiplier;
      let width = (size*splitRatio[0]/splitRatio[1])/((1+(splitRatio[0]/splitRatio[1])**2)**0.5)*pxMultiplier;

      return {height:height, width:width
      };
    };

    update(id) {
      // console.log(obj[id].height);
      // obj[id].height = obj[id].calculate(obj[id].size, obj[id].ratio).height;
      // console.log(obj[id].height);
      // obj[id].width = obj[id].calculate(obj[id].size, obj[id].ratio).width;
      $("#" + this._id).closest(".monitor").css("width", this.width);
      $("#" + this._id).closest(".monitor").css("height", this.height);
    };


    destroy(id) {
      $("#" + id).closest(".monitor").remove();
      $("#" + id).closest("tr").remove();
    };

    rotate(id) {
      console.log(obj[id]);
      var height = obj[id].width;
      var width = obj[id].height;
      obj[id].height = height;
      obj[id].width = width;
      // console.log(obj[id]);
    }
}


//Create monitor
$("#addMonitor").on("click", function(){
  i++;
  obj[i] = new Monitor();
  console.log("Monitor object created: " + i);
  $("#monitorArea").append("<div class=\"monitor\" id=\"" + obj[i]._id + "\"><p class=\"monitorNumber\"></p></div>");
  const table = "<td id=\"dropdownCell\" class=\"dropdownCell\"><input id=\"input\" type=\"number\" name=\"Diagonal\" class=\"no-spin\" value=\"24\"></td><td class=\"dropdownCell\"><select class=\"ui fluid normal dropdown ratioSelect\"><option value=\"16-9\">16:9</option><option value=\"16-10\">16:10</option><option value=\"21-9\">21:9</option><option value=\"4-3\">4:3</option></select></td><td class=\"rotate\"><i class=\"large redo alternate icon\"></i>Rotate</td><td class=\"remove\"><i class=\"large times icon\"></i>Remove</td></tr>"
  // console.log(obj[i].height);
  // console.log(obj[i].ratio);
  // console.log(obj[i].size);
  obj[i].height = obj[i].calculate(obj[i].size, obj[i].ratio).height;
  // console.log(obj[i].height);
  obj[i].width = obj[i].calculate(obj[i].size, obj[i].ratio).width;
  obj[i].update(i);
	$("#table").append("<tr id=" + obj[i]._id + "><td colspan=\"2\">" + obj[i]._id + "</td>" + table);
 	$(".monitor:last").css("left", 49 + obj[i]._id + "%").css("top", 14 + obj[i]._id + "%");
 	$(".monitor p:last").text(obj[i]._id);
 	events();
});

//triger click to create first monitor
$("#addMonitor").trigger("click");

function events(){
  $(".ratioSelect").change(function(){
    let id = $(this).closest("tr").attr("id");
    obj[id].ratio = $(this).val();
    obj[id].height = obj[id].calculate(obj[id].size, obj[id].ratio).height;
    obj[id].width = obj[id].calculate(obj[id].size, obj[id].ratio).width;
    obj[id].update(id);
  });

  $("input").change(function(){
    let id = $(this).closest("tr").attr("id");
    obj[id].size = $(this).val();
    obj[id].height = obj[id].calculate(obj[id].size, obj[id].ratio).height;
    obj[id].width = obj[id].calculate(obj[id].size, obj[id].ratio).width;
    obj[id].update(id);
  });

  $(function() {
	  $(".monitor").draggable({ containment: "#monitorArea", scroll: false, snap:true });
	 });

   //remove monitor
   $(".remove").on("click", function(){
     let id = $(this).closest("tr").attr("id");
 		 obj[id].destroy(id);
    });

    //Rotate monitor
    $(".rotate").unbind().on("click", function(){
      let id = $(this).closest("tr").attr("id");
      obj[id].rotate(id);
      obj[id].update(id);
      console.log("rotated");
    });

    //remove offset
    $(".monitor").on("mouseenter", function(){
      $(this).css("transform", "translateX(0%)");
    });
};
