function addElement(element) {
  section = $(element).parents('.form_section')[0];
  to_copy = $(element).parent('span')[0];
  clone = $(to_copy).clone();
  $(to_copy).children('.form_add').empty();
  console.log(section)
  $(section).append(clone);
}

function deleteElement(element){
  to_del = $(element).parent('span')[0];
  $(to_del).empty();
}
