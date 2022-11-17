use std::fmt;
use std::fs;
use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};

use http::ThreadPool;

const NUM_THREADS: usize = 4;

fn safe_main() -> std::io::Result<TcpListener> {
    let listener = TcpListener::bind("127.0.0.1:7878")?;
    let pool = ThreadPool::new(NUM_THREADS);

    for stream in listener.incoming() {
        let stream = stream?;
        
        let handle = pool.execute(|| {
            handle_stream(stream);

            // Drop implementation for stream automatically closes
            // the connection
        });

        match handle {
            Ok(_) => (),
            Err(e) => eprintln!("ERROR: {}", e),
        }
    }

    Ok(listener)
}

/// TODO: Ideally this would be laid out in memory in a way that
/// I could just reinterpret this into &[u8] instead of going the
/// to_string().as_bytes() route.
struct Response {
    status: u16,
    body: String,
}

impl Response {
    fn reason(&self) -> &str {
        match self.status {
            200 => "OK",
            404 => "NOT_FOUND",
            _ => "ERROR",
        }
    }
}

impl fmt::Display for Response {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "HTTP/1.1 {} {}\r\nContent-Length: {}\r\n\r\n{}",
            self.status,
            self.reason(),
            self.body.len(),
            self.body
        )
    }
}

fn handle_stream(mut stream: TcpStream) -> std::io::Result<()> {
    let reader = BufReader::new(&mut stream);
    let request_line = reader.lines().next().unwrap()?;

    let index_body = fs::read_to_string("templates/index.html")?;
    let not_found_body = fs::read_to_string("templates/404.html")?;

    let response = match &request_line[..] {
        "GET / HTTP/1.1" => Response {
            status: 200,
            body: index_body,
        },
        "GET /sleep HTTP/1.1" => {
            std::thread::sleep(std::time::Duration::from_secs(5));
            Response {
                status: 200,
                body: index_body,
            }
        }
        _ => Response {
            status: 404,
            body: not_found_body,
        },
    };

    stream.write_all(response.to_string().as_bytes())
}

fn main() {
    match safe_main() {
        Err(e) => eprintln!("ERROR: {}", e),
        _ => (),
    }
}
