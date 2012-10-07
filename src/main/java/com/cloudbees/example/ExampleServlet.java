package com.cloudbees.example;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

/**
 * Just an example so we can compile some code at this point.
 */
public class ExampleServlet extends HttpServlet {
  public void doGet(HttpServletRequest request,
                    HttpServletResponse response)
      throws ServletException, IOException {
      
    PrintWriter out = response.getWriter();

    out.println("Hello World");
  }
}
