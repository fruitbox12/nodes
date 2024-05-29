import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    ClickAwayListener,
    Divider,
    Paper,
    Stack,
    Popper,
    Typography,
    TextField,
    Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme, styled } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import lodash from 'lodash';
import * as Yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import InputParameters from 'views/inputs/InputParameters';
import OutputResponses from 'views/output/OutputResponses';
import VariableSelector from './VariableSelector';
import EditVariableDialog from 'ui-component/dialog/EditVariableDialog';
import { StyledFab } from 'ui-component/StyledFab';
import { ColorExtractor } from 'react-color-extractor';
import nodesApi from 'api/nodes';
import useApi from 'hooks/useApi';
import { IconPencil, IconMinus, IconCheck } from '@tabler/icons';
import { getAvailableNodeIdsForVariable, numberOrExpressionRegex, handleCredentialParams } from 'utils/genericHelper';

const GlowingMainCard = styled(MainCard)(({ theme, iconColor }) => ({
    boxShadow: `0 0 20px ${iconColor}40, 0 0 40px ${iconColor}30, 0 0 60px ${iconColor}20,
                inset 0 0 60px ${iconColor}20, inset 0 0 15px ${iconColor}40`,
    transition: 'all 0.3s ease-in-out',
}));

const EditNodes = ({ node, nodes, edges, workflow, onNodeLabelUpdate, onNodeValuesUpdate }) => {
    const theme = useTheme();

    const [nodeFlowData, setNodeFlowData] = useState(null);
    const [nodeLabel, setNodeLabel] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [nodeDetails, setNodeDetails] = useState(null);
    const [nodeParams, setNodeParams] = useState([]);
    const [nodeParamsType, setNodeParamsType] = useState([]);
    const [nodeParamsInitialValues, setNodeParamsInitialValues] = useState({});
    const [nodeParamsValidation, setNodeParamsValidation] = useState({});
    const [isVariableSelectorOpen, setVariableSelectorOpen] = useState(false);
    const [variableBody, setVariableBody] = useState({});
    const [availableNodesForVariable, setAvailableNodesForVariable] = useState(null);
    const [isEditVariableDialogOpen, setEditVariableDialog] = useState(false);
    const [editVariableDialogProps, setEditVariableDialogProps] = useState({});

    const anchorRef = useRef(null);
    const ps = useRef();
    const [iconUrl, setIconUrl] = useState(node?.icon || 'defaultIconUrlHere');
    const [iconColor, setIconColor] = useState('#FFFFFF');

    const handleColorExtraction = (colors) => {
        if (colors.length > 0) {
            setIconColor(colors[0]);
        }
    };

    useEffect(() => {
        if (node && node.icon) {
            setIconUrl(node.icon);
        }
    }, [node]);

    const getSpecificNodeApi = useApi(nodesApi.getSpecificNode);

    const scrollTop = () => {
        const curr = ps.current;
        if (curr) {
            curr.scrollTop = 0;
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
        setVariableSelectorOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        if (open) setVariableSelectorOpen(false);
    };

    const handleAccordionChange = (paramsType) => (event, isExpanded) => {
        setExpanded(isExpanded ? paramsType : false);
        scrollTop();
    };

    const handleNodeLabelChange = (event) => {
        setNodeLabel(event.target.value);
    };

    const saveNodeLabel = () => {
        onNodeLabelUpdate(nodeLabel);
    };

    const onEditVariableDialogOpen = (input, values, arrayItemBody) => {
        const variableNodesIds = getAvailableNodeIdsForVariable(nodes, edges, node.id);

        const nodesForVariable = [];
        for (let i = 0; i < variableNodesIds.length; i += 1) {
            const nodeId = variableNodesIds[i];
            const node = nodes.find((nd) => nd.id === nodeId);
            nodesForVariable.push(node);
        }

        const dialogProps = {
            input,
            values,
            arrayItemBody,
            availableNodesForVariable: nodesForVariable,
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save'
        };

        setEditVariableDialogProps(dialogProps);
        setEditVariableDialog(true);
    };

    const setVariableSelectorState = (variableSelectorState, body) => {
        setVariableSelectorOpen(variableSelectorState);
        if (body) {
            setVariableBody(body);
            const variableNodesIds = getAvailableNodeIdsForVariable(nodes, edges, node.id);

            const nodesForVariable = [];
            for (let i = 0; i < variableNodesIds.length; i += 1) {
                const nodeId = variableNodesIds[i];
                const node = nodes.find((nd) => nd.id === nodeId);
                nodesForVariable.push(node);
            }
            setAvailableNodesForVariable(nodesForVariable);
        }
    };

    const paramsChanged = (formParams, paramsType) => {
        const credentialMethodParam = formParams.find((param) => param.name === 'credentialMethod');
        const credentialMethodParamIndex = formParams.findIndex((param) => param.name === 'credentialMethod');

        if (credentialMethodParam !== undefined) {
            const originalParam = nodeDetails[paramsType].find((param) => param.name === 'credentialMethod');
            if (originalParam !== undefined) {
                formParams[credentialMethodParamIndex]['options'] = originalParam.options;
            }
        }

        const updateNodeDetails = {
            ...nodeDetails,
            [paramsType]: formParams
        };
        setNodeDetails(updateNodeDetails);
    };

    const valueChanged = (formValues, paramsType) => {
        const updateNodeFlowData = {
            ...nodeFlowData,
            [paramsType]: formValues
        };

        if (nodeFlowData.outputResponses) {
            const outputResponsesFlowData = nodeFlowData.outputResponses;
            outputResponsesFlowData.submit = null;
            outputResponsesFlowData.needRetest = true;
            updateNodeFlowData.outputResponses = outputResponsesFlowData;
        }

        setNodeFlowData(updateNodeFlowData);
        onNodeValuesUpdate(updateNodeFlowData);
    };

    const onVariableSelected = (returnVariablePath) => {
        if (variableBody) {
            const path = variableBody.path;
            const paramsType = variableBody.paramsType;
            const newInput = `${variableBody.textBeforeCursorPosition}{{${returnVariablePath}}}${variableBody.textAfterCursorPosition}`;
            const clonedNodeFlowData = lodash.cloneDeep(nodeFlowData);
            lodash.set(clonedNodeFlowData, path, newInput);
            valueChanged(clonedNodeFlowData[paramsType], paramsType);
        }
    };

    const onSubmit = (formValues, paramsType) => {
        const updateNodeFlowData = {
            ...nodeFlowData,
            [paramsType]: formValues
        };
        setNodeFlowData(updateNodeFlowData);
        onNodeValuesUpdate(updateNodeFlowData);

        const index = nodeParamsType.indexOf(paramsType);
        if (index >= 0 && index !== nodeParamsType.length - 1) {
            setExpanded(nodeParamsType[index + 1]);
            scrollTop();
        }
    };

    const showHideParameters = (input, displayType, index, toBeDeleteParams) => {
        const displayOptions = input[displayType];
        Object.keys(displayOptions).forEach((path) => {
            const comparisonValue = displayOptions[path];
            if (path.includes('$index')) {
                path = path.replace('$index', index);
            }
            const groundValue = lodash.get(nodeFlowData, path, '');

            if (Array.isArray(comparisonValue)) {
                if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                    toBeDeleteParams.push(input);
                }
                if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                    toBeDeleteParams.push(input);
                }
            } else if (typeof comparisonValue === 'string') {
                if (displayType === 'show' && !(comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                    toBeDeleteParams.push(input);
                }
                if (displayType === 'hide' && (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                    toBeDeleteParams.push(input);
                }
            }
        });
    };

    const displayParameters = (params, paramsType, arrayIndex) => {
        const toBeDeleteParams = [];

        for (let i = 0; i < params.length; i += 1) {
            const input = params[i];

            if (input.type === 'array') {
                const arrayInitialValue = lodash.get(nodeFlowData, `${paramsType}.${input.name}`, []);
                const inputArray = [];
                for (let j = arrayIndex; j < arrayInitialValue.length; j += 1) {
                    inputArray.push(displayParameters(input.array || [], paramsType, j));
                }
                input.arrayParams = inputArray;
            }
            if (input.show) {
                showHideParameters(input, 'show', arrayIndex, toBeDeleteParams);
            }
            if (input.hide) {
                showHideParameters(input, 'hide', arrayIndex, toBeDeleteParams);
            }
        }

        let returnParams = params;
        for (let i = 0; i < toBeDeleteParams.length; i += 1) {
            returnParams = returnParams.filter((prm) => JSON.stringify(prm) !== JSON.stringify(toBeDeleteParams[i]));
        }
        return returnParams;
    };

    const showHideOptions = (displayType, index, options) => {
        let returnOptions = options;
        const toBeDeleteOptions = [];

        for (let i = 0; i < returnOptions.length; i += 1) {
            const option = returnOptions[i];
            const displayOptions = option[displayType];
            if (displayOptions) {
                Object.keys(displayOptions).forEach((path) => {
                    const comparisonValue = displayOptions[path];

                    if (path.includes('$index')) {
                        path = path.replace('$index', index);
                    }
                    const groundValue = lodash.get(nodeFlowData, path, '');

                    if (Array.isArray(comparisonValue)) {
                        if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option);
                        }
                        if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option);
                        }
                    } else if (typeof comparisonValue === 'string') {
                        if (displayType === 'show' && !(comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                            toBeDeleteOptions.push(option);
                        }
                        if (displayType === 'hide' && (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                            toBeDeleteOptions.push(option);
                        }
                    }
                });
            }
        }

        for (let i = 0; i < toBeDeleteOptions.length; i += 1) {
            returnOptions = returnOptions.filter((opt) => JSON.stringify(opt) !== JSON.stringify(toBeDeleteOptions[i]));
        }

        return returnOptions;
    };

    const displayOptions = (params, paramsType, arrayIndex) => {
        let clonedParams = params;

        for (let i = 0; i < clonedParams.length; i += 1) {
            const input = clonedParams[i];

            if (input.type === 'array') {
                const arrayInitialValue = lodash.get(nodeFlowData, `${paramsType}.${input.name}`, []);
                const inputArray = [];
                for (let j = arrayIndex; j < arrayInitialValue.length; j += 1) {
                    inputArray.push(displayOptions(input.arrayParams[j] || [], paramsType, j));
                }
                input.arrayParams = inputArray;
            }

            if (input.type === 'options') {
                input.options = showHideOptions('show', arrayIndex, input.options);
                input.options = showHideOptions('hide', arrayIndex, input.options);
            }
        }

        return clonedParams;
    };

    const setYupValidation = (params) => {
        const validationSchema = {};
        for (let i = 0; i < params.length; i += 1) {
            const input = params[i];
            let inputOptional = input.optional;

            if (typeof input.optional === 'object' && input.optional !== null) {
                const keys = Object.keys(input.optional);
                inputOptional = true;
                for (let j = 0; j < keys.length; j += 1) {
                    const path = keys[j];
                    const comparisonValue = input.optional[path];
                    const groundValue = lodash.get(nodeFlowData, path, '');

                    if (Array.isArray(comparisonValue)) {
                        inputOptional = inputOptional && comparisonValue.includes(groundValue);
                    } else if (typeof comparisonValue === 'string') {
                        inputOptional = inputOptional && (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue));
                    }
                }
            }

            if (
                input.name === 'credentialMethod' && input.type === 'string' && !inputOptional
            ) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required.`);
            } else if (
                (input.type === 'string' ||
                    input.type === 'password' ||
                    input.type === 'date' ||
                    input.type === 'code' ||
                    input.type === 'json' ||
                    input.type === 'file' ||
                    input.type === 'options' ||
                    input.type === 'asyncOptions') &&
                !inputOptional
            ) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required. Type: ${input.type}`);
            } else if (input.type === 'number' && !inputOptional) {
                validationSchema[input.name] = Yup.string()
                    .required(`${input.label} is required. Type: ${input.type}`)
                    .matches(numberOrExpressionRegex, `${input.label} must be numbers or a variable expression.`);
            } else if (input.type === 'array' && !inputOptional) {
                /*
                ************
                * Limitation on different object shape within array: https://github.com/jquense/yup/issues/757
                ************
                const innerValidationSchema = setYupValidation(input.arrayParams);
                validationSchema[input.name] = Yup.array(Yup.object(innerValidationSchema)).required(`Must have ${input.label}`).min(1, `Minimum of 1 ${input.label}`);
                */
            }
        }
        return validationSchema;
    };

    const initializeFormValuesAndParams = (paramsType) => {
        const initialValues = {};

        const reorganizedParams = displayParameters(nodeDetails[paramsType] || [], paramsType, 0);
        let nodeParams = displayOptions(lodash.cloneDeep(reorganizedParams), paramsType, 0);

        nodeParams = handleCredentialParams(nodeParams, paramsType, reorganizedParams, nodeFlowData);

        for (let i = 0; i < nodeParams.length; i += 1) {
            const input = nodeParams[i];

            if (paramsType in nodeFlowData && input.name in nodeFlowData[paramsType]) {
                initialValues[input.name] = nodeFlowData[paramsType][input.name];

                if (input.type === 'options') {
                    const optionVal = input.options.find((option) => option.name === initialValues[input.name]);
                    if (!optionVal) delete initialValues[input.name];
                }
            } else {
                initialValues[input.name] = input.default || '';
            }
        }

        initialValues.submit = null;

        setNodeParamsInitialValues(initialValues);
        setNodeParamsValidation(setYupValidation(nodeParams));
        setNodeParams(nodeParams);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        if (getSpecificNodeApi.data) {
            const nodeDetails = getSpecificNodeApi.data;

            setNodeDetails(nodeDetails);

            const nodeParamsType = [];

            if (nodeDetails.actions) nodeParamsType.push('actions');
            if (nodeDetails.networks) nodeParamsType.push('networks');
            if (nodeDetails.credentials) nodeParamsType.push('credentials');
            if (nodeDetails.inputParameters) nodeParamsType.push('inputParameters');
            nodeParamsType.push('outputResponses');

            setNodeParamsType(nodeParamsType);

            if (nodeParamsType.length) {
                setExpanded(nodeParamsType[0]);
                scrollTop();
            }
        }
    }, [getSpecificNodeApi.data]);

    useEffect(() => {
        if (node) {
            setOpen(true);
            setNodeLabel(node.data.label);
            setNodeFlowData(node.data);
            getSpecificNodeApi.request(node.data.name);
        }
    }, [node]);

    useEffect(() => {
        if (nodeDetails && nodeFlowData && expanded) {
            initializeFormValuesAndParams(expanded);
        }
    }, [nodeDetails, nodeFlowData, expanded]);

    return (
        <>
            <ColorExtractor getColors={handleColorExtraction}>
                <img src={iconUrl} alt="Node Icon" style={{ display: 'none' }} />
            </ColorExtractor>

            <StyledFab sx={{ left: 40, top: 20 }} ref={anchorRef} size="small" color="secondary" onClick={handleToggle} title="Edit Node">
                {open ? <IconMinus /> : <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.3536 13.3536C12.1583 13.5488 11.8417 13.5488 11.6465 13.3536L6.39645 8.10355C6.36478 8.07188 6.33824 8.03702 6.31685 8H5.00002C4.78719 8 4.59769 7.86528 4.52777 7.66426L2.12777 0.764277C2.05268 0.548387 2.13355 0.309061 2.3242 0.182972C2.51486 0.0568819 2.76674 0.0761337 2.93602 0.229734L8.336 5.12972C8.44044 5.22449 8.50001 5.35897 8.50001 5.5V5.81684C8.53702 5.83824 8.57189 5.86478 8.60356 5.89645L13.8536 11.1464C14.0488 11.3417 14.0488 11.6583 13.8536 11.8536L12.3536 13.3536ZM8.25 6.95711L7.45711 7.75L12 12.2929L12.7929 11.5L8.25 6.95711ZM3.71669 2.28845L5.35549 7H6.2929L7.50001 5.79289V5.72146L3.71669 2.28845Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}
            </StyledFab>
            <div className="sidebar">
                <Popper
                    placement="bottom-end"
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    popperOptions={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [1200, 14]
                                }
                            }
                        ]
                    }}
                    sx={{ zIndex: 1000 }}
                >
                    {({ TransitionProps }) => (
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <GlowingMainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]} iconColor={iconColor}>
                                        <Box sx={{ p: 2 }}>
                                            <Stack>
                                                <Typography variant="h4">Edit Nodes</Typography>
                                            </Stack>
                                        </Box>
                                        <PerfectScrollbar
                                            containerRef={(el) => {
                                                ps.current = el;
                                            }}
                                            style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}
                                        >
                                            {!node && <Box sx={{ p: 2 }}>No data</Box>}

                                            {nodeFlowData && nodeFlowData.label && (
                                                <Box
                                                    sx={{
                                                        pl: 4,
                                                        pr: 4,
                                                        pt: 2,
                                                        pb: 2,
                                                        textAlign: 'center',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <TextField
                                                        id={nodeFlowData.name}
                                                        label="Node Label"
                                                        variant="outlined"
                                                        value={nodeLabel}
                                                        onChange={handleNodeLabelChange}
                                                        fullWidth
                                                    />
                                                    <StyledFab
                                                        sx={{
                                                            minHeight: 10,
                                                            height: 27,
                                                            width: 30,
                                                            ml: 2
                                                        }}
                                                        size="small"
                                                        color="secondary"
                                                        title="Validate and Save"
                                                        onClick={saveNodeLabel}
                                                    >
                                                        <IconCheck />
                                                    </StyledFab>
                                                </Box>
                                            )}

                                            {/* actions */}
                                            {nodeParamsType.includes('actions') && (
                                                <Box sx={{ p: 2 }}>
                                                    <Accordion expanded={expanded === 'actions'} onChange={handleAccordionChange('actions')}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="actions-content"
                                                            id="actions-header"
                                                        >
                                                            <Typography variant="h4">Actions</Typography>
                                                            {nodeFlowData && nodeFlowData.actions && nodeFlowData.actions.submit && (
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        ...theme.typography.smallAvatar,
                                                                        borderRadius: '50%',
                                                                        background: theme.palette.success.dark,
                                                                        color: 'white',
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <IconCheck />
                                                                </Avatar>
                                                            )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <InputParameters
                                                                key={node.id}
                                                                params={nodeParams}
                                                                paramsType="actions"
                                                                initialValues={nodeParamsInitialValues}
                                                                nodeParamsValidation={nodeParamsValidation}
                                                                nodeFlowData={nodeFlowData}
                                                                setVariableSelectorState={setVariableSelectorState}
                                                                onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                                valueChanged={valueChanged}
                                                                onSubmit={onSubmit}
                                                            />
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Divider />
                                                </Box>
                                            )}

                                            {/* networks */}
                                            {nodeParamsType.includes('networks') && (
                                                <Box sx={{ p: 2 }}>
                                                    <Accordion expanded={expanded === 'networks'} onChange={handleAccordionChange('networks')}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="networks-content"
                                                            id="networks-header"
                                                        >
                                                            <Typography variant="h4">Networks</Typography>
                                                            {nodeFlowData && nodeFlowData.networks && nodeFlowData.networks.submit && (
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        ...theme.typography.smallAvatar,
                                                                        borderRadius: '50%',
                                                                        background: theme.palette.success.dark,
                                                                        color: 'white',
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <IconCheck />
                                                                </Avatar>
                                                            )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <InputParameters
                                                                key={node.id}
                                                                params={nodeParams}
                                                                paramsType="networks"
                                                                initialValues={nodeParamsInitialValues}
                                                                nodeParamsValidation={nodeParamsValidation}
                                                                nodeFlowData={nodeFlowData}
                                                                setVariableSelectorState={setVariableSelectorState}
                                                                onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                                valueChanged={valueChanged}
                                                                onSubmit={onSubmit}
                                                            />
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Divider />
                                                </Box>
                                            )}

                                            {/* credentials */}
                                            {nodeParamsType.includes('credentials') && (
                                                <Box sx={{ p: 2 }}>
                                                    <Accordion
                                                        expanded={expanded === 'credentials'}
                                                        onChange={handleAccordionChange('credentials')}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="credentials-content"
                                                            id="credentials-header"
                                                        >
                                                            <Typography variant="h4">Credentials</Typography>
                                                            {nodeFlowData && nodeFlowData.credentials && nodeFlowData.credentials.submit && (
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        ...theme.typography.smallAvatar,
                                                                        borderRadius: '50%',
                                                                        background: theme.palette.success.dark,
                                                                        color: 'white',
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <IconCheck />
                                                                </Avatar>
                                                            )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            {nodeParams.find(param => param.name === 'credentialMethod')?.type === 'string' ? (
                                                                <TextField
                                                                    name="credentialMethod"
                                                                    label={nodeParams.find(param => param.name === 'credentialMethod')?.label || 'Credential Method'}
                                                                    placeholder={nodeParams.find(param => param.name === 'credentialMethod')?.placeholder || ''}
                                                                    value={nodeFlowData.credentials?.credentialMethod || ''}
                                                                    onChange={(e) => {
                                                                        const updatedNodeFlowData = {
                                                                            ...nodeFlowData,
                                                                            credentials: {
                                                                                ...nodeFlowData.credentials,
                                                                                credentialMethod: e.target.value
                                                                            }
                                                                        };
                                                                        setNodeFlowData(updatedNodeFlowData);
                                                                        onNodeValuesUpdate(updatedNodeFlowData);
                                                                    }}
                                                                    fullWidth
                                                                />
                                                            ) : (
                                                                <InputParameters
                                                                    key={node.id}
                                                                    params={nodeParams}
                                                                    paramsType="credentials"
                                                                    initialValues={nodeParamsInitialValues}
                                                                    nodeParamsValidation={nodeParamsValidation}
                                                                    nodeFlowData={nodeFlowData}
                                                                    setVariableSelectorState={setVariableSelectorState}
                                                                    onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                                    valueChanged={valueChanged}
                                                                    onSubmit={onSubmit}
                                                                />
                                                            )}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Divider />
                                                </Box>
                                            )}

                                            {/* inputParameters */}
                                            {nodeParamsType.includes('inputParameters') && (
                                                <Box sx={{ p: 2 }}>
                                                    <Accordion
                                                        expanded={expanded === 'inputParameters'}
                                                        onChange={handleAccordionChange('inputParameters')}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="inputParameters-content"
                                                            id="inputParameters-header"
                                                        >
                                                            <Typography variant="h4">Input Parameters</Typography>
                                                            {nodeFlowData &&
                                                                nodeFlowData.inputParameters &&
                                                                nodeFlowData.inputParameters.submit && (
                                                                    <Avatar
                                                                        variant="rounded"
                                                                        sx={{
                                                                            ...theme.typography.smallAvatar,
                                                                            borderRadius: '50%',
                                                                            background: theme.palette.success.dark,
                                                                            color: 'white',
                                                                            ml: 2
                                                                        }}
                                                                    >
                                                                        <IconCheck />
                                                                    </Avatar>
                                                                )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <InputParameters
                                                                key={node.id}
                                                                params={nodeParams}
                                                                paramsType="inputParameters"
                                                                initialValues={nodeParamsInitialValues}
                                                                nodeParamsValidation={nodeParamsValidation}
                                                                nodeFlowData={nodeFlowData}
                                                                setVariableSelectorState={setVariableSelectorState}
                                                                onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                                valueChanged={valueChanged}
                                                                onSubmit={onSubmit}
                                                            />
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Divider />
                                                </Box>
                                            )}

                                            {/* outputResponses */}
                                            {nodeDetails && nodeFlowData && (
                                                <Box sx={{ p: 2 }}>
                                                    <Accordion
                                                        expanded={expanded === 'outputResponses'}
                                                        onChange={handleAccordionChange('outputResponses')}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="outputResponses-content"
                                                            id="outputResponses-header"
                                                        >
                                                            <Typography variant="h4">Output Responses</Typography>
                                                            {nodeFlowData &&
                                                                nodeFlowData.outputResponses &&
                                                                nodeFlowData.outputResponses.submit && (
                                                                    <Avatar
                                                                        variant="rounded"
                                                                        sx={{
                                                                            ...theme.typography.smallAvatar,
                                                                            borderRadius: '50%',
                                                                            background: theme.palette.success.dark,
                                                                            color: 'white',
                                                                            ml: 2
                                                                        }}
                                                                    >
                                                                        <IconCheck />
                                                                    </Avatar>
                                                                )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <OutputResponses
                                                                key={node.id}
                                                                nodeId={node.id}
                                                                nodeParamsType={nodeParamsType}
                                                                nodeFlowData={nodeFlowData}
                                                                nodes={nodes}
                                                                edges={edges}
                                                                workflow={workflow}
                                                                onSubmit={onSubmit}
                                                            />
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <Divider />
                                                </Box>
                                            )}
                                        </PerfectScrollbar>
                                        <VariableSelector
                                            key={JSON.stringify(availableNodesForVariable)}
                                            nodes={availableNodesForVariable}
                                            isVariableSelectorOpen={isVariableSelectorOpen}
                                            anchorEl={anchorRef.current}
                                            onVariableSelected={(returnVariablePath) => onVariableSelected(returnVariablePath)}
                                            handleClose={() => setVariableSelectorOpen(false)}
                                        />
                                        <EditVariableDialog
                                            key={JSON.stringify(editVariableDialogProps)}
                                            show={isEditVariableDialogOpen}
                                            dialogProps={editVariableDialogProps}
                                            onCancel={() => setEditVariableDialog(false)}
                                            onConfirm={(updateValues) => {
                                                valueChanged(updateValues, expanded);
                                                setEditVariableDialog(false);
                                            }}
                                        />
                                    </GlowingMainCard>
                                </ClickAwayListener>
                            </Paper>
                        </Transitions>
                    )}
                </Popper>
            </div>
        </>
    );
};

EditNodes.propTypes = {
    node: PropTypes.object,
    nodes: PropTypes.array,
    edges: PropTypes.array,
    workflow: PropTypes.object,
    onNodeLabelUpdate: PropTypes.func,
    onNodeValuesUpdate: PropTypes.func
};

export default EditNodes;
