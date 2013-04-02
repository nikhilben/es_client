if (typeof define !== 'function') { var define = require('amdefine')(module) }
define( function(require,exports,module){

/*

  #TableView

  An interactive table interface for a single sheet.

  ## References
  * Sheet
  * SelectionCollection

*/

var $ = require('jquery');
var t = require('es_client/templates');
var RefBinder = require('ref-binder');
var View = require('backbone').View;
var _ = require('underscore');
var Table = module.exports = View.extend({

  events: {
    'click .es-table-cell': 'cellClicked',
    'change .es-table-cell-input': 'changeCell',
    'keydown': 'inputKeypress'
  },

  initialize: function(o){
    this.models = new RefBinder(this);
    this.setSheet(o.sheet || null);
    this.setSelections(o.selections || null);
    this.setLocalSelection(o.local_selection || null);
  },

  setSheet: function(sheet){
    this.models.set('sheet',sheet,{
      'update_cell': 'onUpdateCell',
      'commit_cell': 'onCommitCell',
      'insert_col': 'render',
      'delete_col': 'render',
      'insert_row': 'render',
      'delete_row': 'render'
    });
  },

  setSelections: function(selections){
    this.models.set('selections',selections,{
      'add_cell': 'onRemoteAddCell',
      'clear': 'onClear'
    }); 
  },

  setLocalSelection: function(local_selection){
    this.models.set('local_selection',local_selection,{
      'add_cell': 'onLocalAddCell',
      'clear': 'onClear'
    });
  },

  paintCell: function(cell){
    var $cell = $('#'+cell.row_id+'-'+cell.col_id, this.el);
    $cell.css('background-color', cell.color);
  },
    
  onRemoteAddCell: function(cell){
    this.paintCell(cell);
  },

  onLocalAddCell: function(cell){
    var $cell = $('#'+cell.row_id+'-'+cell.col_id, this.el);
    var e = {currentTarget: $cell};

    this.paintCell($cell);
    this.removeCellInputs();
    this.createCellInput(e);
  },

  onClear: function(cells){
    var table = this;
    _.each(cells, function(cell){
      cell.color = '#ffffff';
      table.paintCell(cell);
    });
  },

  getSheet: function(){
    return this.models.get('sheet');
  },

  getSelections: function(){
    return this.models.get('selections');
  },

  getLocalSelection: function(){
    return this.models.get('local_selection');
  },

  getId: function(){
    return this.getSheet().cid;
  },

  render: function(){

    var $el = this._$el = $(t.sheet_table({id:this.getId()}));

    $('#es-data-table-'+this.getId(),$el)
      .html(t.table({sheet:this.getSheet()}));
    $('#es-column-headers-'+this.getId(),$el)
      .html(t.table_col_headers({num_col:this.getSheet().colCount()}));
    $('#es-row-headers-'+this.getId(),$el)
      .html(t.table_row_headers({num_row:this.getSheet().rowCount()}));

    this.swapElement();
    this.initializeElements();
    this.initializeScrolling();
    return this;
  },

  initializeElements: function(){
    this.$table = $('#es-table-'+this.getId(),this.$el);
    this.$grid = $('#es-grid-container-'+this.getId(),this.$el);
    this.$table_col_headers = $('#es-column-headers-'+this.getId(),this.$el);
    this.$table_row_headers = $('#es-row-headers-'+this.getId(),this.$el);
  },

  initializeScrolling: function(){
    var view = this;
    var grid_el = this.$grid[0];
    this.$grid.scroll(function(e){
      view.$table_col_headers.css('left',(0-grid_el.scrollLeft)+"px");
      view.$table_row_headers.css('top',(0-grid_el.scrollTop)+"px");
    });
  },

  swapElement: function(){
    this.$el.html(this._$el);
  },

  cellClicked: function(e){
    this.selectCell(e);
  },

  removeCellInputs: function(){
    $('.es-table-cell-input').remove();

  },

  selectCell: function(e){
    var s = this.getLocalSelection();
    var data = $(e.currentTarget).data();
    s.clear();
    s.addCell(this.getSheet().id,data.row_id.toString(),data.col_id.toString());
  },

  createCellInput: function(e){
    var s = this.getSelections().getLocal();
    var $el = $(e.currentTarget);
    var x = $el.position().left + this.$grid.scrollLeft();
    var y = $el.position().top + this.$grid.scrollTop();;
    var width = $el.width();
    var height = $el.height() - 2;
    var color = s.getColor();
    var row_id = $el.data().row_id.toString();
    var col_id = $el.data().col_id.toString();
    var cell_value = this.getSheet().getDisplayFormula(row_id,col_id);

    var $input = $("<input id='"+$el.attr('id')+"-input' data-row_id='"+row_id+"' data-col_id='"+col_id+"' class='es-table-cell-input' value='"+cell_value+"' style='left: "+x+"px; top: "+y+"px; width: "+width+"px; height: "+height+"px; background-color: "+color+";' />");
    
    this.$grid.append($input);
    $input.focus();
    var timer = null;
    var sheet = this.getSheet();
    $input.on('keyup', function(){
      this.old_val = this.old_val || '';
      if($input.val() != this.old_val){
        sheet.updateCell(row_id, col_id, $input.val(), $el.text()); 
        this.old_val = $input.val() || this.old_val;
      }
    });
    return $input;
  },

  changeCell: function(e){
    var $el = $(e.currentTarget);
    var data = $el.data();
    this.getSheet().commitCell(data.row_id.toString(), data.col_id.toString(), $el.val());
  },

  inputKeypress: function(e){
    //return unless code is 'enter' or 'tab' 
<<<<<<< HEAD
    var code = (e.keyCode ? e.keyCode : e.which);
=======
    var UP    =-1;
    var LEFT  =-1;
    var DOWN  = 1;
    var RIGHT = 1;
    var NONE  = 0;
>>>>>>> 75ad3ba224382eb3bbd5e3d2fc98ab18b198bca0
    if(code != 13 && code != 9) return;
    
    var UP    =-1;
    var LEFT  =-1;
    var DOWN  = 1;
    var RIGHT = 1;
    var NONE  = 0;

    var cell = this.getLocalSelection().getCells()[0];
    this.getSheet().commitCell(cell.row_id.toString(), cell.col_id.toString());
    if(code == 13){
      this.moveSelection(e,DOWN,NONE);
    }
    if(code == 9){
      this.moveSelection(e,NONE,RIGHT);
    }
    return false;
  },

  moveSelection: function(e, row_offset, col_offset){
<<<<<<< HEAD
    var selection = this.getLocalSelection();
    var old_cell = selection.getCells()[0];
=======
    var cell = this.getSelections().getLocal().getCells()[0];
    console.log('cell',cell);
    var old_cell = $('#' + cell.row_id + '-' + cell.col_id + '-input' );
    console.log('old_cell',old_cell);
    this.getSheet().commitCell(cell.row_id.toString(), cell.col_id.toString(), cell.value);
>>>>>>> 75ad3ba224382eb3bbd5e3d2fc98ab18b198bca0
    var rows = this.getSheet().rows;
    var cols = this.getSheet().cols;
    var new_col_idx = _.indexOf(cols,old_cell.col_id) + col_offset;
    var new_col = cols[new_col_idx];
    var new_row_idx = _.indexOf(rows,old_cell.row_id) + row_offset;
    var new_row = rows[new_row_idx];
    selection.clear();
    selection.addCell(this.getSheet().id, new_row, new_col);

  },

  onUpdateCell: function(cell){
    var $el = $('#'+cell.row_id+'-'+cell.col_id);
    var input =$('#' + $el.attr('id') + '-input');
    $el.text(cell.cell_display);
    if(input.length > 0){
      input.val(cell.cell_display);
    }
  },  

  onCommitCell: function(cell){
    this.onUpdateCell(cell);
  },  

  destroy: function(){
    this.remove();
    this.models.unsetAll();
  }
});

});
