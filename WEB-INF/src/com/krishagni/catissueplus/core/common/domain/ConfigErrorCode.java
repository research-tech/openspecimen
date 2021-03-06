package com.krishagni.catissueplus.core.common.domain;

import com.krishagni.catissueplus.core.common.errors.ErrorCode;

public enum ConfigErrorCode implements ErrorCode {
	MODULE_NOT_FOUND,
	
	SETTING_NOT_FOUND,
	
	INVALID_SETTING_VALUE;

	@Override
	public String code() {
		return "CFG_" + this.name();
	}
}
