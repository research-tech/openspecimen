package com.krishagni.catissueplus.core.init;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import krishagni.catissueplus.beans.FormContextBean;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.StringUtils;

public class ImportEntityForms extends ImportForms {
	private int order = 1;
	
	private Map<String, String> entityMap = new HashMap<String, String>();
	
	@Override
	public void afterPropertiesSet() throws Exception {
		setCreateTable(true);
		super.afterPropertiesSet();
	}

	@Override 
	protected List<String> listFormFiles() 
	throws IOException {
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(getClass().getClassLoader());

		Resource[] resources = resolver.getResources("classpath:/entity-forms/*_extension.xml");
		for (Resource resource: resources) {
			String filename = resource.getFilename();
			String entityType = StringUtils.capitalize(filename.split("_")[0]) + "Extension";
			entityMap.put("entity-forms/" + filename, entityType);
		}

		return new ArrayList<String>(entityMap.keySet());
	}

	@Override
	protected FormContextBean getFormContext(String formFile, Long formId) {
		String entityType = entityMap.get(formFile);
		FormContextBean formCtx = getDaoFactory().getFormDao().getFormContext(formId, -1L, entityType);
		if (formCtx == null) {
			formCtx = new FormContextBean();
		}

		formCtx.setContainerId(formId);
		formCtx.setCpId(-1L);
		formCtx.setEntityType(entityType);
		formCtx.setMultiRecord(false);
		formCtx.setSortOrder(order);
		formCtx.setSysForm(true);
		return formCtx;		
	}

	@Override
	protected void cleanup() {
		order = 1;
	}
}
