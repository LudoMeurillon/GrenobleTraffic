package com.meurillon;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TrafficStatusServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			int key = Double.valueOf(Math.random()*1000000).intValue();
			
            URL url = new URL("http://www.stationmobile.fr/stationmobilecore/XML/Carto/Dynamique/dynTroncons.json?key="+key);
            BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
            String line;

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(resp.getOutputStream()));
            
            while ((line = reader.readLine()) != null) {
                writer.write(line);
            }
            reader.close();
            writer.close();
        } catch (MalformedURLException e) {
            
        } catch (IOException e) {
            
        }
	}
}
