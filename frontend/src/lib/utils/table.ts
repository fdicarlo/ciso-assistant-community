import SelectFilter from '$lib/components/Filters/SelectFilter.svelte';
import CheckboxFilter from '$lib/components/Filters/CheckboxFilter.svelte';
import type { ComponentType } from 'svelte';
import { LOCALE_DISPLAY_MAP } from './constants';
import type { Row } from '@vincjo/datatables';
import * as m from '$paraglide/messages';

type JSONObject = { [key: string]: JSONObject } | JSONObject[] | string | number | boolean | null;

interface ListViewFilterConfig {
	component: ComponentType;
	filter?: (columnValue: any, value: any) => boolean;
	getColumn?: (row: Row) => Row[keyof Row];
	filterProps?: (rows: any[], field: string) => { [key: string]: any };
	extraProps?: { [key: string]: any };
	alwaysDisplay?: boolean;
	alwaysDefined?: boolean;
}

interface ListViewFieldsConfig {
	[key: string]: {
		head: string[];
		body: string[];
		meta?: string[];
		breadcrumb_link_disabled?: boolean;
		filters?: {
			[key: string]: ListViewFilterConfig;
		};
	};
}

const PROJECT_STATUS_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.lc_status,
	extraProps: {
		defaultOptionName: 'status'
	},
	alwaysDisplay: true
};

const DOMAIN_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.folder.str,
	alwaysDefined: true,
	extraProps: {
		defaultOptionName: 'domain'
	}
};

const DOMAIN_FILTER_FROM_META: ListViewFilterConfig = {
	...DOMAIN_FILTER,
	getColumn: (row) => row.meta.folder.str
};

const DOMAIN_FILTER_FROM_META_PROJECT: ListViewFilterConfig = {
	...DOMAIN_FILTER,
	getColumn: (row) => row.meta.project.folder.str
};

const PROJECT_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.project.str,
	extraProps: {
		defaultOptionName: 'project' // Make translations
	}
};

const PROJECT_FILTER_FROM_META: ListViewFilterConfig = {
	...PROJECT_FILTER,
	getColumn: (row) => row.meta.project.str
};

const STATUS_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.status,
	extraProps: {
		defaultOptionName: 'status'
	},
	alwaysDisplay: true
};

const TREATMENT_FILTER: ListViewFilterConfig = {
	// I could make a function just make the code less repeatitive and long for nothing
	component: SelectFilter,
	getColumn: (row) => row.meta.treatment,
	extraProps: {
		defaultOptionName: 'treatment'
	}
};

const STATE_FILTER: ListViewFilterConfig = {
	// I could make a function just make the code less repeatitive and long for nothing
	component: SelectFilter,
	getColumn: (row) => row.meta.state,
	extraProps: {
		defaultOptionName: 'state'
	}
};

const APPROVER_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => {
		if (row.first_name && row.last_name) {
			return `${row.first_name} ${row.last_name}`;
		}
		return row.meta.approver.str; // This display the email in the approver filter, is this a problem because of email leak risks ?
	},
	extraProps: {
		defaultOptionName: 'approver'
	}
};

const RISK_ASSESSMENT_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.risk_assessment.name,
	extraProps: {
		defaultOptionName: 'riskAssessment'
	}
};

const PROVIDER_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => {
		console.log(row);
		return row.provider;
	},
	extraProps: {
		defaultOptionName: 'provider'
	}
};

const PROVIDER_FILTER_FOR_LIBRARIES: ListViewFilterConfig = {
	...PROVIDER_FILTER,
	getColumn: (row) => {
		return row.meta.provider;
	},
	alwaysDisplay: true
};

const THREAT_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.threats,
	filter: (rowThreatName, threatName) => {
		if (!threatName) return true;
		return rowThreatName === threatName;
	},
	filterProps: (rows, _) => {
		const threatSet = new Set();
		for (const row of rows) {
			for (const threat of row.meta.threats) {
				threatSet.add(threat.str);
			}
		}
		const options = [...threatSet].sort();
		return { options };
	},
	extraProps: {
		defaultOptionName: 'threat'
	}
};

const ASSET_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.assets,
	filter: (rowAssetName, assetName) => {
		if (!assetName) return true;
		return rowAssetName === assetName;
	},
	filterProps: (rows, _) => {
		const assetSet = new Set();
		for (const row of rows) {
			for (const asset of row.meta.assets) {
				assetSet.add(asset.str);
			}
		}
		const options = [...assetSet].sort();
		return { options };
	},
	extraProps: {
		defaultOptionName: 'asset'
	},
	alwaysDisplay: true
};

const FRAMEWORK_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.framework.ref_id,
	extraProps: {
		defaultOptionName: 'framework' // Make translations
	}
};

const LANGUAGE_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.locale,
	extraProps: {
		defaultOptionName: 'language', // Make translations
		optionLabels: LOCALE_DISPLAY_MAP
	}
};

const ASSET_TYPE_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.type,
	extraProps: {
		defaultOptionName: 'type' // Make translations
	},
	alwaysDisplay: true
};

const CATEGORY_FILTER: ListViewFilterConfig = {
	component: SelectFilter,
	getColumn: (row) => row.meta.category,
	extraProps: {
		defaultOptionName: 'category' // Make translations
	},
	alwaysDisplay: true
};

/* const HAS_RISK_MATRIX_FILTER: ListViewFilterConfig = {
	component: CheckboxFilter,
	getColumn: row => {
		return !row.meta.overview.some(
			line => line.startsWith("risk_matrix")
		); // It would be better to directly have a boolean given by the library data which is set to True when the library has a risk matrix or false otherwise.
	},
	filterProps: (rows: any[],field: string) => new Object(),
	filter: (builtin: boolean, value: boolean): boolean => {
		return value ? !builtin : true;
	},
	extraProps: {
		title: "Only display matrix libraries" // Make translations
	}
}; */

export const listViewFields: ListViewFieldsConfig = {
	folders: {
		head: ['name', 'description', 'parentDomain'],
		body: ['name', 'description', 'parent_folder']
	},
	projects: {
		head: ['name', 'description', 'domain'],
		body: ['name', 'description', 'folder'],
		filters: {
			folder: DOMAIN_FILTER,
			lc_status: PROJECT_STATUS_FILTER
		}
	},
	'risk-matrices': {
		head: ['name', 'description', 'provider', 'domain'],
		body: ['name', 'description', 'provider', 'folder'],
		meta: ['id', 'urn'],
		filters: {
			folder: DOMAIN_FILTER
		}
	},
	'risk-assessments': {
		head: ['name', 'riskMatrix', 'description', 'riskScenarios', 'project'],
		body: ['str', 'risk_matrix', 'description', 'risk_scenarios_count', 'project'],
		filters: {
			folder: { ...DOMAIN_FILTER_FROM_META_PROJECT, alwaysDisplay: true },
			project: PROJECT_FILTER,
			status: { ...STATUS_FILTER, alwaysDisplay: true }
		}
	},
	threats: {
		head: ['ref', 'name', 'description', 'provider', 'domain'],
		body: ['ref_id', 'name', 'description', 'provider', 'folder'],
		meta: ['id', 'urn'],
		filters: {
			folder: DOMAIN_FILTER
		}
	},
	'risk-scenarios': {
		head: ['name', 'threats', 'riskAssessment', 'appliedControls', 'currentLevel', 'residualLevel'],
		body: [
			'name',
			'threats',
			'risk_assessment',
			'applied_controls',
			'current_level',
			'residual_level'
		],
		filters: {
			folder: { ...DOMAIN_FILTER_FROM_META_PROJECT, alwaysDisplay: true },
			project: { ...PROJECT_FILTER_FROM_META, alwaysDisplay: true },
			treatment: { ...TREATMENT_FILTER, alwaysDisplay: true },
			risk_assessment: RISK_ASSESSMENT_FILTER,
			threats: THREAT_FILTER,
			assets: ASSET_FILTER
		}
	},
	'risk-acceptances': {
		head: ['name', 'description', 'riskScenarios'],
		body: ['name', 'description', 'risk_scenarios'],
		filters: {
			folder: DOMAIN_FILTER_FROM_META,
			state: STATE_FILTER,
			approver: APPROVER_FILTER
		}
	},
	'applied-controls': {
		head: ['name', 'description', 'category', 'eta', 'domain', 'referenceControl'],
		body: ['name', 'description', 'category', 'eta', 'folder', 'reference_control'],
		filters: {
			folder: DOMAIN_FILTER,
			status: STATUS_FILTER,
			category: CATEGORY_FILTER
		}
	},
	policies: {
		head: ['name', 'description', 'eta', 'domain', 'referenceControl'],
		body: ['name', 'description', 'eta', 'folder', 'reference_control'],
		filters: {
			folder: DOMAIN_FILTER
		}
	},
	'reference-controls': {
		head: ['ref', 'name', 'description', 'category', 'provider', 'domain'],
		body: ['ref_id', 'name', 'description', 'category', 'provider', 'folder'],
		meta: ['id', 'urn'],
		filters: {
			folder: { ...DOMAIN_FILTER, alwaysDisplay: true },
			category: CATEGORY_FILTER
		}
	},
	assets: {
		head: ['name', 'description', 'businessValue', 'domain'],
		body: ['name', 'description', 'business_value', 'folder'],
		filters: {
			folder: DOMAIN_FILTER,
			type: ASSET_TYPE_FILTER
		}
	},
	users: {
		head: ['email', 'firstName', 'lastName'],
		body: ['email', 'first_name', 'last_name']
	},
	'user-groups': {
		head: ['name'],
		body: ['localization_dict'],
		meta: ['id', 'builtin']
	},
	roles: {
		head: ['name', 'description'],
		body: ['name', 'description']
	},
	'role-assignments': {
		head: ['user', 'userGroup', 'role', 'perimeter'],
		body: ['user', 'user_group', 'role', 'perimeter_folders']
	},
	frameworks: {
		head: ['name', 'description', 'provider', 'complianceAssessments', 'domain'],
		body: ['name', 'description', 'provider', 'compliance_assessments', 'folder'],
		meta: ['id', 'urn'],
		filters: {
			folder: DOMAIN_FILTER,
			provider: PROVIDER_FILTER
		}
	},
	'compliance-assessments': {
		head: ['name', 'framework', 'description', 'project'],
		body: ['name', 'framework', 'description', 'project'],
		filters: {
			folder: { ...DOMAIN_FILTER_FROM_META_PROJECT, alwaysDisplay: true }, // alwaysDisplay shoudln't be mandatory here something is wrong
			project: PROJECT_FILTER,
			framework: FRAMEWORK_FILTER,
			status: STATUS_FILTER
		}
	},
	'requirement-assessments': {
		head: ['name', 'description', 'complianceAssessment'],
		body: ['name', 'description', 'compliance_assessment'],
		breadcrumb_link_disabled: true
	},
	evidences: {
		head: ['name', 'file', 'size', 'description'],
		body: ['name', 'attachment', 'size', 'description'],
		filters: {
			folder: { ...DOMAIN_FILTER_FROM_META, alwaysDisplay: true } // This filter should also be displayed even without alwaysDisplay
		}
	},
	requirements: {
		head: ['ref', 'name', 'description', 'framework'],
		body: ['ref_id', 'name', 'description', 'framework'],
		meta: ['id', 'urn']
	},
	libraries: {
		head: ['ref', 'name', 'description', 'language', 'overview'],
		body: ['ref_id', 'name', 'description', 'locale', 'overview']
	},
	'stored-libraries': {
		head: ['ref', 'name', 'description', 'language', 'overview'],
		body: ['ref_id', 'name', 'description', 'locale', 'overview'],
		filters: {
			locale: LANGUAGE_FILTER,
			provider: PROVIDER_FILTER_FOR_LIBRARIES
			// has_risk_matrix: HAS_RISK_MATRIX_FILTER
		}
	},
	'loaded-libraries': {
		head: ['ref', 'name', 'description', 'language', 'overview'],
		body: ['ref_id', 'name', 'description', 'locale', 'overview'],
		filters: {
			locale: LANGUAGE_FILTER,
			provider: PROVIDER_FILTER_FOR_LIBRARIES
		}
	},
	'sso-settings': {
		head: ['name', 'provider', 'providerId'],
		body: ['name', 'provider', 'provider_id']
	},
	'requirement-mapping-sets': {
		head: ['sourceFramework', 'targetFramework'],
		body: ['source_framework', 'target_framework']
	}
};
