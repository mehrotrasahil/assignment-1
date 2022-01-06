$(function () {
    $('table')
        .on('click', 'th', function () {
           
            $(".arrowfun").attr('style','display:none');
            var index = $(this).index(),
                rows = [],
                thClass = $(this).hasClass('asc') ? 'desc' : 'asc';

            $('#table-id th').removeClass('asc desc');
            $(this).addClass(thClass);

            $('#table-id tbody tr').each(function (index, row) {
                rows.push($(row).detach());
            });

            rows.sort(function (a, b) {
                var aValue = $(a).find('td').eq(index).text(),
                    bValue = $(b).find('td').eq(index).text();

                return aValue > bValue
                    ? 1
                    : aValue < bValue
                        ? -1
                        : 0;
            });

            if ($(this).hasClass('desc')) {
                rows.reverse();
            }

            $.each(rows, function (index, row) {
                $('#table-id tbody').append(row);
            });
        });
});


getPagination('#table-id');
//getPagination('.table-class');
//getPagination('table');

/*					PAGINATION 
- on change max rows select options fade out all rows gt option value mx = 5
- append pagination list as per numbers of rows / max rows option (20row/5= 4pages )
- each pagination li on click -> fade out all tr gt max rows * li num and (5*pagenum 2 = 10 rows)
- fade out all tr lt max rows * li num - max rows ((5*pagenum 2 = 10) - 5)
- fade in all tr between (maxRows*PageNum) and (maxRows*pageNum)- MaxRows 
*/


function getPagination(table) {
    var lastPage = 1;

    $('#maxRows')
        .on('change', function (evt) {
            //$('.paginationprev').html('');						// reset pagination

            lastPage = 1;
            $('.pagination')
                .find('li')
                .slice(1, -1)
                .remove();
            var trnum = 0; // reset tr counter
            var maxRows = parseInt($(this).val()); // get Max Rows from select option

            if (maxRows == 5000) {
                $('.pagination').hide();
            } else {
                $('.pagination').show();
            }

            var totalRows = $(table + ' tbody tr').length; // numbers of rows
            $(table + ' tr:gt(0)').each(function () {
                // each TR in  table and not the header
                trnum++; // Start Counter
                if (trnum > maxRows) {
                    // if tr number gt maxRows

                    $(this).hide(); // fade it out
                }
                if (trnum <= maxRows) {
                    $(this).show();
                } // else fade in Important in case if it ..
            }); //  was fade out to fade it in
            if (totalRows > maxRows) {
                // if tr total rows gt max rows option
                var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
                //	numbers of pages
                for (var i = 1; i <= pagenum;) {
                    // for each page append pagination li
                    $('.pagination #prev')
                        .before(
                            '<li data-page="' +
                            i +
                            '">\
                          <span>' +
                            i++ +
                            '<span class="sr-only">(current)</span></span>\
                        </li>'
                        )
                        .show();
                } // end for i
            } // end if row count > max rows
            $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
            $('.pagination li').on('click', function (evt) {
                // on click each page
                evt.stopImmediatePropagation();
                evt.preventDefault();
                var pageNum = $(this).attr('data-page'); // get it's number

                var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

                if (pageNum == 'prev') {
                    if (lastPage == 1) {
                        return;
                    }
                    pageNum = --lastPage;
                }
                if (pageNum == 'next') {
                    if (lastPage == $('.pagination li').length - 2) {
                        return;
                    }
                    pageNum = ++lastPage;
                }

                lastPage = pageNum;
                var trIndex = 0; // reset tr counter
                $('.pagination li').removeClass('active'); // remove active class from all li
                $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
                // $(this).addClass('active');					// add active class to the clicked
                limitPagging();
                $(table + ' tr:gt(0)').each(function () {
                    // each tr in table not the header
                    trIndex++; // tr index counter
                    // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                    if (
                        trIndex > maxRows * pageNum ||
                        trIndex <= maxRows * pageNum - maxRows
                    ) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    } //else fade in
                }); // end of for each tr in table
            }); // end of on click pagination list
            limitPagging();
        })
        .val(15)
        .change();

    // end of on select change

    // END OF PAGINATION
}

function limitPagging() {
    // alert($('.pagination li').length)

    if ($('.pagination li').length > 7) {
        if ($('.pagination li.active').attr('data-page') <= 3) {
            $('.pagination li:gt(15)').hide();
            $('.pagination li:lt(15)').show();
            $('.pagination [data-page="next"]').show();
        } if ($('.pagination li.active').attr('data-page') > 3) {
            $('.pagination li:gt(0)').hide();
            $('.pagination [data-page="next"]').show();
            for (let i = (parseInt($('.pagination li.active').attr('data-page')) - 2); i <= (parseInt($('.pagination li.active').attr('data-page')) + 2); i++) {
                $('.pagination [data-page="' + i + '"]').show();

            }

        }
    }
}

var
    filters = {
        city: null,
        state: null,
        beds: null,
        baths: null
    };

function updateFilters() {
    $('#table-id').hide().filter(function () {
        var
            self = $(this),
            result = true; // not guilty until proven guilty

        Object.keys(filters).forEach(function (filter) {
            if (filters[filter] && (filters[filter] != 'None') && (filters[filter] != 'Any')) {
                result = result && filters[filter] === self.data(filter);
            }
        });

        return result;
    }).show();
}

function changeFilter(filterName) {
    filters[filterName] = this.value;
    updateFilters();
}

// Assigned User Dropdown Filter
$('#assigned-city-filter').on('change', function () {
    changeFilter.call(this, 'city');
});

// Task Status Dropdown Filter
$('#status-filter').on('change', function () {
    changeFilter.call(this, 'state');
});

// Task Milestone Dropdown Filter
$('#milestone-filter').on('change', function () {
    changeFilter.call(this, 'baths');
});

// Task Priority Dropdown Filter
$('#priority-filter').on('change', function () {
    changeFilter.call(this, 'beds');
});


/* Filter Code */
(function(document) {
	'use strict';

	var TableFilter = (function(Arr) {

		var _input;

		function _onInputEvent(e) {
			_input = e.target;
			var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
			Arr.forEach.call(tables, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, _filter);
				});
			});
		}

		function _filter(row) {
			var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}

		return {
			init: function() {
				var inputs = document.getElementsByClassName('light-table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = _onInputEvent;
				});
			}
		};
	})(Array.prototype);

	document.addEventListener('readystatechange', function() {
		if (document.readyState === 'complete') {
			TableFilter.init();
		}
	});

})(document); 


