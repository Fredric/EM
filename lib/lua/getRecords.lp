
HTTP/1.0 200 OK
Content-Type: text/html


<?
  -- for k,v in pairs(_G) do mg.write(k, '\n') end

  -- Open database
  local db = sqlite3.open('requests2.db')
  JSON = (loadfile "JSON.lua")()
  
  db:exec([[
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp NOT NULL,
      method NOT NULL,
      uri NOT NULL,
      addr
    );
  ]])


  local stmt = db:prepare(
    'INSERT INTO requests VALUES(NULL, datetime("now"), ?, ?, ?);');
  stmt:bind_values(mg.request_info.request_method,
                   mg.request_info.uri,
                   mg.request_info.remote_port)
  stmt:step()
  stmt:finalize()

local results = {}

for row in db:nrows('SELECT * FROM requests ORDER BY id DESC;') do
  table.insert(results, row)
   row = {}
end


mg.write(JSON:encode(results))
 

  db:close()
?>
