<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/struts-logic.tld" prefix="logic" %>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean" %>
<%@ page language="java" isELIgnored="false" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<head>
<!-- Mandar : 434 : for tooltip -->
<script language="JavaScript" type="text/javascript" src="jss/javaScript.js"></script>
	<script language="javascript">
		
	</script>
</head>
<html:errors/>
<html:messages id="messageKey" message="true" header="messages.header" footer="messages.footer">
	<%=messageKey%>
</html:messages>
   
<table width="100%" border="0" cellpadding="0" cellspacing="0" class="newMaintable">
<html:form action='${requestScope.formName}'>
	<html:hidden property="operation"/>
	<html:hidden property="id" />
  <tr>
    <td class="td_color_bfdcf3"><table width="100%" border="0" cellpadding="0" cellspacing="0" class="whitetable_bg">
		<tr  class="td_color_bfdcf3">
        <td width="100%" colspan="3" valign="top" class="td_color_bfdcf3">
					
							<table width="15%" border="0" cellpadding="0" cellspacing="0" background="images/uIEnhancementImages/table_title_bg.gif">
									<tr >
                    <td width="82%" ><span class="wh_ar_b">&nbsp;&nbsp;&nbsp;<bean:message key="Biohazard.header" /></span></td>
                    <td width="18%" align="right"><img src="images/uIEnhancementImages/table_title_corner2.gif" width="31" height="24" /></td>
                  </tr>
								</table>
							</td>
						</tr>
						<tr>
							<td width="1%" valign="top" class="td_color_bfdcf3">&nbsp;
							</td>
				            <td width="9%" valign="top" class="td_tab_bg">&nbsp;
							</td>
						    <td width="90%" valign="bottom" class="td_color_bfdcf3" style="padding-top:4px;">
								<table width="100%" border="0" cellpadding="0" cellspacing="0">
				                  <tr>
						            <td width="4%" class="td_tab_bg" >&nbsp;
									</td>
							<!-- for tabs selection -->
							<logic:equal name="operation" value="add">
								    <td width="6%" valign="bottom" background="images/uIEnhancementImages/tab_bg.gif" ><img src="images/uIEnhancementImages/tab_add_user.jpg" alt="Add" width="57" height="22" /></td>

                    <td width="6%" valign="bottom" background="images/uIEnhancementImages/tab_bg.gif"><html:link page="/SimpleQueryInterface.do?pageOf=pageOfBioHazard&aliasName=Biohazard&menuSelected=8" ><img src="images/uIEnhancementImages/tab_edit_user.jpg" alt="Edit" width="59" height="22" border="0" /></html:link></td>
							</logic:equal>
							<logic:equal name="operation" value="edit">
									<td width="6%" valign="bottom" background="images/uIEnhancementImages/tab_bg.gif" ><html:link page="/Biohazard.do?operation=add&pageOf=pageOfBioHazard&menuSelected=8"><img src="images/uIEnhancementImages/tab_add_user1.jpg" alt="Add" width="57" height="22" border="0" /></html:link></td>

                    <td width="6%" valign="bottom" background="images/uIEnhancementImages/tab_bg.gif"><img src="images/uIEnhancementImages/tab_edit_user1.jpg" alt="Edit" width="59" height="22" /></td>
							</logic:equal>
									<td valign="bottom" background="images/uIEnhancementImages/tab_bg.gif">&nbsp;
									</td>
						            <td width="1%" align="left" valign="bottom" class="td_color_bfdcf3" >&nbsp;
									</td>
								</tr>
							</table>
						  </td>
						</tr>
					
			 <tr>
		        <td colspan="3" class="td_color_bfdcf3" style="padding-left:10px; padding-right:10px;					padding-bottom:10px;">
					<table width="100%" border="0" cellpadding="3" cellspacing="0" bgcolor="#FFFFFF">
						<tr>
							<td align="left">
								<span class=" grey_ar_s">
									<img src="images/uIEnhancementImages/star.gif" alt="Mandatory" width="6" height="6" hspace="0" vspace="0" />
										<bean:message key="commonRequiredField.message" />
								</span>
							</td>
						</tr>
						
						<tr>
							<td align="left" class="tr_bg_blue1">
								<span class="blue_ar_b">
					<logic:equal name="operation" value='${requestScope.operationAdd}'>
									<bean:message key="biohazard.title"/>
					</logic:equal>
					<logic:equal name="operation" value='${requestScope.operationEdit}'>
									<bean:message key="biohazard.editTitle"/>
					</logic:equal>
								</span>
							</td>
						</tr>
						<tr>
							<td align="left" style="padding-top:10px; padding-bottom:15px;">
							    <table width="100%" border="0" cellpadding="3" cellspacing="0">
								    <tr>
										<td width="1%" align="left" class="black_ar">
											<span class="blue_ar_b">
												<img src="images/uIEnhancementImages/star.gif" alt="Mandatory" width="6" height="6" hspace="0" vspace="0" />
											</span>
										</td>
						                <td width="16%" align="left" class="black_ar">
											<label for="name">
												<bean:message key="biohazard.name"/> 
											</label>
										</td>
				                        <td width="82%" align="left">
											<label>
												<html:text styleClass="black_ar"  maxlength="255"  size="30" styleId="name" property="name"/>
											</label>
										</td>
							          </tr>
								      <tr>
									    <td align="left" class="black_ar">
											<span class="blue_ar_b">
												<img src="images/uIEnhancementImages/star.gif" alt="Mandatory" width="6" height="6" hspace="0" vspace="0" />
											</span>
										</td>
						                <td align="left" class="black_ar">
											<label for="type">
												<bean:message key="biohazard.type"/>
											</label>
										</td>
				                        <td align="left">
											<html:select property="type" styleClass="formFieldSizedNew" styleId="type" size="1" onmouseover="showTip(this.id)" onmouseout="hideTip(this.id)">
												<html:options collection='${requestScope.biohazard_Type_List}' labelProperty="name" property="value"/>
											</html:select>
										</td>
									</tr>
									<tr>
										<td align="left" class="black_ar">&nbsp;
										</td>
										<td align="left" class="black_ar">
											<label for="comments">
												<bean:message key="biohazard.comments"/>
											</label>
										</td>
						                <td align="left">
											<html:textarea styleClass="black_ar_s" property="comments" styleId="comments" cols="34" rows="3"/>
										</td>
									</tr>
	                          </table>
						</td>
		            </tr>
				    <tr  class="td_color_F7F7F7">
						<td class="buttonbg">
							<html:submit styleClass="blue_ar_b" >
								<bean:message key="buttons.submit"/>
							</html:submit>
							&nbsp;| 
								<span class="cancellink">
									<html:link page="/ManageAdministrativeData.do" styleClass="blue_ar_s_b">
										<bean:message key="buttons.cancel" />
									</html:link>
								</span>
							</td>
			            </tr>
		        </table>
			</td>
      </tr>
    </table>
	</td>
  </tr>
  </html:form>
</table>