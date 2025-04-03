--1.:

-- Desactivar las restricciones de clave foránea temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Actualizar IDs en la tabla modules
UPDATE modules SET id = 'html-introduction' WHERE id = 'html-intro';
UPDATE modules SET id = 'css-introduction' WHERE id = 'css-intro';
UPDATE modules SET id = 'javascript-intro' WHERE id = 'js-intro';
UPDATE modules SET id = 'javascript-functions' WHERE id = 'js-functions';
UPDATE modules SET id = 'javascript-dom' WHERE id = 'js-dom';
UPDATE modules SET id = 'javascript-async' WHERE id = 'js-async';

-- Ya aplicados anteriormente (Python)
UPDATE modules SET id = 'python-intro' WHERE id = 'py-intro';
UPDATE modules SET id = 'python-functions' WHERE id = 'py-functions';
UPDATE modules SET id = 'python-control-flow' WHERE id = 'py-control-flow';
UPDATE modules SET id = 'python-modules' WHERE id = 'py-modules';

-- Actualizar module_id en la tabla lessons
UPDATE lessons SET module_id = 'html-introduction' WHERE module_id = 'html-intro';
UPDATE lessons SET module_id = 'css-introduction' WHERE module_id = 'css-intro';
UPDATE lessons SET module_id = 'javascript-intro' WHERE module_id = 'js-intro';
UPDATE lessons SET module_id = 'javascript-functions' WHERE module_id = 'js-functions';
UPDATE lessons SET module_id = 'javascript-dom' WHERE module_id = 'js-dom';
UPDATE lessons SET module_id = 'javascript-async' WHERE module_id = 'js-async';

-- Ya aplicados anteriormente (Python)
UPDATE lessons SET module_id = 'python-intro' WHERE module_id = 'py-intro';
UPDATE lessons SET module_id = 'python-functions' WHERE module_id = 'py-functions';
UPDATE lessons SET module_id = 'python-control-flow' WHERE module_id = 'py-control-flow';
UPDATE lessons SET module_id = 'python-modules' WHERE module_id = 'py-modules';

-- Reactivar restricciones de clave foránea
SET FOREIGN_KEY_CHECKS = 1;

--2.:

SET FOREIGN_KEY_CHECKS = 0;

UPDATE modules SET id = 'python-control' WHERE id = 'python-control-flow';
UPDATE lessons SET module_id = 'python-control' WHERE module_id = 'python-control-flow';

UPDATE modules SET id = 'css-box' WHERE id = 'css-box-model';
UPDATE lessons SET module_id = 'css-box' WHERE module_id = 'css-box-model';

SET FOREIGN_KEY_CHECKS = 1;
