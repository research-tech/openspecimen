package com.krishagni.catissueplus.rest.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.krishagni.catissueplus.core.common.events.EventStatus;
import com.krishagni.catissueplus.core.common.events.UserSummary;
import com.krishagni.catissueplus.core.de.events.QueryFolderSummary;
import com.krishagni.catissueplus.core.de.events.SavedQuerySummary;
import com.krishagni.catissueplus.core.de.events.UpdateFolderQueriesEvent;
import com.krishagni.catissueplus.core.de.events.CreateQueryFolderEvent;
import com.krishagni.catissueplus.core.de.events.DeleteQueryFolderEvent;
import com.krishagni.catissueplus.core.de.events.QueryFolderDetails;
import com.krishagni.catissueplus.core.de.events.ReqFolderQueriesEvent;
import com.krishagni.catissueplus.core.de.events.QueryFolderCreatedEvent;
import com.krishagni.catissueplus.core.de.events.QueryFolderDeletedEvent;
import com.krishagni.catissueplus.core.de.events.FolderQueriesEvent;
import com.krishagni.catissueplus.core.de.events.QueryFolderSharedEvent;
import com.krishagni.catissueplus.core.de.events.QueryFoldersEvent;
import com.krishagni.catissueplus.core.de.events.QueryFolderUpdatedEvent;
import com.krishagni.catissueplus.core.de.events.FolderQueriesUpdatedEvent;
import com.krishagni.catissueplus.core.de.events.ReqQueryFoldersEvent;
import com.krishagni.catissueplus.core.de.events.ShareQueryFolderEvent;
import com.krishagni.catissueplus.core.de.events.UpdateQueryFolderEvent;
import com.krishagni.catissueplus.core.de.services.QueryService;

import edu.wustl.catissuecore.util.global.Constants;
import edu.wustl.common.beans.SessionDataBean;

@Controller
@RequestMapping("/query-folders")
public class QueryFoldersController {
	
	@Autowired
	private HttpServletRequest httpServletRequest;

	@Autowired
	private QueryService querySvc;
	
	@RequestMapping(method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public List<QueryFolderSummary> getFoldersForUser(){
		ReqQueryFoldersEvent req = new ReqQueryFoldersEvent();
		req.setSessionDataBean(getSession());
		QueryFoldersEvent resp = querySvc.getUserFolders(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getFolders();
		}
		
		return null;
	}
	
	@RequestMapping(method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public QueryFolderDetails createFolder(@RequestBody QueryFolderDetails folderDetails) {
		CreateQueryFolderEvent req = new CreateQueryFolderEvent();
		req.setFolderDetails(folderDetails);
		req.setSessionDataBean(getSession());
		
		QueryFolderCreatedEvent resp = querySvc.createFolder(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getFolderDetails();
		}
		
		return null;
	}

	@RequestMapping(method = RequestMethod.PUT, value="/{folderId}")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public QueryFolderDetails updateFolder(@PathVariable Long folderId, @RequestBody QueryFolderDetails folderDetails) {
		UpdateQueryFolderEvent req = new UpdateQueryFolderEvent();
		
		folderDetails.setId(folderId);
		req.setFolderDetails(folderDetails);
		req.setSessionDataBean(getSession());
		
		QueryFolderUpdatedEvent resp = querySvc.updateFolder(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getFolderDetails();
		}
		
		return null;
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/{folderId}")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public Long deleteFolder(@PathVariable Long folderId) {
		DeleteQueryFolderEvent req = new DeleteQueryFolderEvent(folderId);
		req.setSessionDataBean(getSession());
		
		QueryFolderDeletedEvent resp = querySvc.deleteFolder(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getFolderId();
		}
		
		return null;
	}
		
	@RequestMapping(method = RequestMethod.GET, value="/{folderId}/saved-queries")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public List<SavedQuerySummary> getFolderQueries(@PathVariable("folderId") Long folderId) {
		ReqFolderQueriesEvent req = new ReqFolderQueriesEvent(folderId);
		req.setSessionDataBean(getSession());
		
		FolderQueriesEvent resp = querySvc.getFolderQueries(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getSavedQueries();
		}
		
		return null;
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/{folderId}/saved-queries")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public List<SavedQuerySummary> updateFolderQueries(@PathVariable("folderId") Long folderId, @RequestBody List<Long> queries) {
		UpdateFolderQueriesEvent req = new UpdateFolderQueriesEvent();
		req.setFolderId(folderId);
		req.setQueries(queries);
		req.setSessionDataBean(getSession());

		FolderQueriesUpdatedEvent resp = querySvc.updateFolderQueries(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getQueries();
		}
		
		return null;
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="/{folderId}/users")
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public List<UserSummary> shareFolder(@PathVariable("folderId") Long folderId, @RequestBody List<Long> userIds){
		ShareQueryFolderEvent req = new ShareQueryFolderEvent();
		req.setFolderId(folderId);
		req.setUserIds(userIds);
		req.setSessionDataBean(getSession());
		
		QueryFolderSharedEvent resp = querySvc.shareFolder(req);
		if (resp.getStatus() == EventStatus.OK) {
			return resp.getUsers();
		}
		
		return null;
	}
		
	private SessionDataBean getSession() {
		return (SessionDataBean) httpServletRequest.getSession().getAttribute(Constants.SESSION_DATA);
	}
}