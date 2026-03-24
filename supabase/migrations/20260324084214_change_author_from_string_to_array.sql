alter table books
rename column author to authors;

alter table books
alter column authors type text[] using authors::text[];