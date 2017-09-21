/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Wes Nolte
 * http://twitter.com/wesnolte
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk
 *
 * Copyright (c) 2011 Wesley Nolte
 * Dual licensed under the MIT and GPL licenses.
 *
 */
(function ($) {
  $.fn.jOrgChart = function (options) {
    const opts = $.extend({}, $.fn.jOrgChart.defaults, options);
    const $appendTo = $(opts.chartElement);

    // build the tree
    $this = $(this);
    const $container = $('<div class=\'' + opts.chartClass + '\'/>');
    if ($this.is('ul')) {
      buildNode($this.find('li:first'), $container, 0, opts);
    } else if ($this.is('li')) {
      buildNode($this, $container, 0, opts);
    }
    $appendTo.append($container);
  };

  // Option defaults
  $.fn.jOrgChart.defaults = {
    chartElement: 'body',
    depth: -1,
    chartClass: 'jOrgChart',
    dragAndDrop: false
  };

  let nodeCount = 0;
  // Method that recursively builds the tree
  function buildNode($node, $appendTo, level, opts) {
    const $table = $('<table cellpadding=\'0\' cellspacing=\'0\' border=\'0\'/>');
    const $tbody = $('<tbody/>');

    // Construct the node container(s)
    const $nodeRow = $('<tr/>').addClass('node-cells');
    const $nodeCell = $('<td/>').addClass('node-cell').attr('colspan', 2);
    const $childNodes = $node.children('ul:first').children('li');
    let $nodeDiv;

    if ($childNodes.length > 1) {
      $nodeCell.attr('colspan', $childNodes.length * 2);
    }
    // Draw the node
    // Get the contents - any markup except li and ul allowed
    const $nodeContent = $node.clone()
      .children('ul,li,i')
      .remove()
      .end()
      .html();

    //Increaments the node count which is used to link the source list and the org chart
    nodeCount++;
    $node.data('tree-node', nodeCount);
    $nodeDiv = $('<div>').addClass('node')
      .data('tree-node', nodeCount)
      .append($nodeContent);

    // Expand and contract nodes
    if ($childNodes.length > 0) {
      $nodeDiv.find('.add').attr('src', '../i/minus.png');
      $nodeDiv.find('.add').click(function () {
        window.parent.playClickEffect();
        const $this = $(this);
        const $tr = $this.closest('tr');

        if ($tr.hasClass('contracted')) {
          $this.css('cursor', 'n-resize');
          $tr.removeClass('contracted').addClass('expanded');
          $tr.nextAll('tr').css('visibility', '');
          $nodeDiv.find('.add').attr('src', '../i/minus.png');
          // Update the <li> appropriately so that if the tree redraws collapsed/non-collapsed nodes
          // maintain their appearance
          $node.removeClass('collapsed');
        } else {
          $this.css('cursor', 's-resize');
          $tr.removeClass('expanded').addClass('contracted');
          $tr.nextAll('tr').css('visibility', 'hidden');
          $nodeDiv.find('.add').attr('src', '../i/add.png');
          $node.addClass('collapsed');
        }
      });
    }
    $nodeCell.append($nodeDiv);
    $nodeRow.append($nodeCell);
    $tbody.append($nodeRow);
    if ($node.clone().children('ul,li').remove().end().find('i').length > 0) {
      addMarkNode($node.clone().children('ul,li').remove().end().find('i'));
    }

    function addMarkNode(nodes) {
      addLineDown();
      const $nodeRow = $('<tr />');
      let $nodeTd = '';
      for (let i = 0; i < $childNodes.length * 2; i++) {
        if (i === $childNodes.length - 1) {
          //$nodeTd += '<td class="markleft" style="position:absolute;left: 8.560004rem;"></td>';
          $nodeTd += '<td class="markleft" style="position:absolute;left: 50%;margin-left: -10.6rem;"></td>';
        } else if (i === $childNodes.length) {
          //$nodeTd += '<td class="line2 markright" style="position:absolute;right:-0.0285rem;"></td>';
          $nodeTd += '<td class="line2" style="position:absolute;right:8.560004rem;"></td>';
        } else {
          $nodeTd += '<td></td>';
        }
      }
      $nodeRow.append($($nodeTd));
      nodes.each((index, item) => {
        const arrow = $(item).attr('arrow');
        const $node = $('<div class="node2" style="position:absolute;top: -4.3648rem;"/>');
        $node.html($(item).html());
        if (arrow === 'left') {
          var ti = $childNodes.length - 1;
          $node.css({ left: '-11.9536rem', 'margin-left': 0 });
        } else {
          var ti = $childNodes.length;
          $node.css({ right: '0', 'margin-right': 0 });
        }
        $nodeRow.find('td').eq(ti).append($('<div style="width:10.6500053rem;border-bottom:1px solid rgba(185,183,175,1);"></div>')).append($node);
        //$nodeRow.find('td').eq(ti).append($('<div style="height:45px;border-bottom:1px solid #747474;"></div>')).append($node);
      });
      $tbody.append($nodeRow);
    }

    function addLineDown() {
      const $downLine = $('<div></div>').addClass('line down');
      const $downLineCell = $('<td/>').attr('colspan', $childNodes.length * 2);
      const $downLineRow = $('<tr add=\'1\'/>');
      $downLineCell.append($downLine);
      $downLineRow.append($downLineCell);
      $tbody.append($downLineRow);
    }

    if ($childNodes.length > 0) {
      // if it can be expanded then change the cursor
      //$nodeDiv.css('cursor','n-resize');

      // recurse until leaves found (-1) or to the level specified
      if (opts.depth === -1 || (level + 1 < opts.depth)) {
        const $downLineRow = $('<tr/>');
        const $downLineCell = $('<td/>').attr('colspan', $childNodes.length * 2);
        $downLineRow.append($downLineCell);

        // draw the connecting line from the parent node to the horizontal line
        $downLine = $('<div></div>').addClass('line down');
        $downLineCell.append($downLine);
        $tbody.append($downLineRow);

        // Draw the horizontal lines
        const $linesRow = $('<tr/>');
        $childNodes.each(() => {
          const $left = $('<td>&nbsp;</td>').addClass('line left top');
          const $right = $('<td>&nbsp;</td>').addClass('line right top');
          $linesRow.append($left).append($right);
        });

        // horizontal line shouldn't extend beyond the first and last child branches
        $linesRow.find('td:first')
          .removeClass('top')
          .end()
          .find('td:last')
          .removeClass('top');

        $tbody.append($linesRow);
        var $childNodesRow = $('<tr/>');
        $childNodes.each(function () {
          const $td = $('<td class=\'node-container\'/>');
          $td.attr('colspan', 2);
          // recurse through children lists and items
          buildNode($(this), $td, level + 1, opts);
          $childNodesRow.append($td);
        });
      }
      $tbody.append($childNodesRow);
    }

    // any classes on the LI element get copied to the relevant node in the tree
    // apart from the special 'collapsed' class, which collapses the sub-tree at this point
    if ($node.attr('class') !== undefined) {
      const classList = $node.attr('class').split(/\s+/);
      $.each(classList, (index, item) => {
        if (item === 'collapsed') {
          console.log($node);
          $nodeRow.nextAll('tr').css('visibility', 'hidden');
          $nodeRow.removeClass('expanded');
          $nodeRow.addClass('contracted');
          // $nodeDiv.css('cursor','s-resize');
        } else {
          $nodeDiv.addClass(item);
        }
      });
    }

    $table.append($tbody);

    $appendTo.append($table);

    /* Prevent trees collapsing if a link inside a node is clicked */
    $nodeDiv.children('a').click((e) => {
      console.log(e);
      //window.parent.playClickEffect();
      e.stopPropagation();
    });
  }
}(jQuery));