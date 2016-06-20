package com.krishagni.catissueplus.core.init;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.jar.Attributes;
import java.util.jar.JarFile;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import com.krishagni.catissueplus.core.common.PluginManager;
import com.krishagni.catissueplus.core.common.util.ClassPathUtil;

public class AppServletContextListener implements ServletContextListener {

	private static final Logger logger = Logger.getLogger(AppServletContextListener.class);

	private static final String APP_PROPS       = "application.properties";

	private static final String DATA_DIR_PROP   = "app.data_dir";

	private static final String LOG_CONF_PROP   = "app.log_conf";

	private static final String DEF_LOG_CONF    = "/default-log4j.properties";

	private static final String PLUGIN_DIR_PROP = "plugin.dir";

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		InputStream in = null;
		
		try {
			in = this.getClass().getClassLoader().getResourceAsStream(APP_PROPS);
			
			Properties props = new Properties();
			props.load(in);

			initLogging(props);

			String pluginDir = props.getProperty(PLUGIN_DIR_PROP);
			if (StringUtils.isNotBlank(pluginDir)) {
				logger.info("Loading plugins from " + pluginDir);
				loadPluginResources(pluginDir);
			}
		} catch (Exception e) {
			logger.error("Error initializing app", e);
			throw new RuntimeException("Error initializing app", e);
		} finally {
			IOUtils.closeQuietly(in);
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub

	}

	private void initLogging(Properties props)
	throws Exception {
		URL url;
		String logConf = props.getProperty(LOG_CONF_PROP);
		if (StringUtils.isNotBlank(logConf)) {
			url = new File(logConf).toURI().toURL();
		} else {
			url = this.getClass().getResource(DEF_LOG_CONF);
		}

		String dataDir = props.getProperty(DATA_DIR_PROP);
		if (StringUtils.isBlank(dataDir)) {
			dataDir = ".";
		}

		String logDir = dataDir + File.separator + "logs";
		new File(logDir).mkdirs();
		System.setProperty("os_log_dir", logDir);

		BasicConfigurator.resetConfiguration();
		PropertyConfigurator.configure(url);
		logger.info("Initialised logging configuration from following file: " + url);
		if (url.getProtocol().equals("file")) {
			PropertyConfigurator.configureAndWatch(url.getFile());
		}
	}

	private void loadPluginResources(String pluginDir) 
	throws IOException {
		File pluginDirFile = new File(pluginDir);
		if (!pluginDirFile.isDirectory()) {
			throw new RuntimeException("Invalid plugin directory: " + pluginDir);
		}

		for (File file : pluginDirFile.listFiles()) {
			if (file.isDirectory() || !file.getName().endsWith(".jar")) {
				continue;
			}

			JarFile jarFile = null;
			try {
				logger.info("Loading plugin resource from: " + file.getAbsolutePath());
				jarFile = new JarFile(file);
				Attributes attrs = jarFile.getManifest().getMainAttributes();
				String pluginName = attrs.getValue("os-plugin-name");
				if (StringUtils.isNotBlank(pluginName)) {
					ClassPathUtil.addFile(file);
					PluginManager.getInstance().addPluginName(pluginName.trim());
				}
			} catch (Exception e) {
				logger.error("Error loading plugin resources from: ", e);
			} finally {
				IOUtils.closeQuietly(jarFile);
			}
		}
	}
}
