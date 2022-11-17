const std = @import("std");

const HttpError = error {
    Oops
};

const Response = struct {
    code: u16,
    message: [:0]const u8,
};

fn healthcheck() HttpError!Response {
    return HttpError.Oops;
}

fn route() void {
    // TODO: Match on the URL fragment
    const res = healthcheck() catch |err| label: {
        std.log.err("ERROR: {}", .{err});
        break :label Response {
            .code = @as(u16, 503),
            .message = "An unexpected error occurred",
        };
    };

    std.log.debug("Response: (.code = {}, .message = \"{s}\")", .{res.code, res.message});
}

pub fn main() !void {

    // Net configuration
    const addr = try std.net.Address.resolveIp("127.0.0.1", 9000);
    var listener = std.net.StreamServer.init(.{});
    defer {
        std.log.debug("Deinit listener", .{});
        listener.deinit();
    }

    try listener.listen(addr);
    std.log.info("Listening on {}...", .{addr});

    while (listener.accept()) |conn| {
        std.log.info("Accepted connection from {}", .{conn.address});

        // serve the route
        route();

        conn.stream.close();
    } else |err| {
        return err;
    }
}

