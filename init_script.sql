INSERT INTO public."Role" (name, description)
VALUES
('not_assigned','Default value to all new users'),
('admin','User with all privilages'),
('general_management','Not an admin but can see everything'),
('operations_management','User with all operations privilages'),
('account_submanagement','User with some account privilages'),
('account_analyst','User which analyzes accounts'),
('change_agents','some description to this'),
('project_leader','some description to this'),
('agile_coach','some description to this');

INSERT INTO public."User"
("name", last_name, email, "password", telephone, role_name)
VALUES
(
    'admin', 
    'admin', 
    'admin@admin.com', 
    '$2b$10$rTdR9c0EfqT0QlqZDdzgMOGPWvTeEve1IrLE/4Sefj4VefYSJd/4q', 
    '00000000', 
    'admin'
)
