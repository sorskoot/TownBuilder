import {Alignment} from '@wonderlandengine/api';
import {Align, FlexDirection, Justify, ReactUiBase} from '@wonderlandengine/react-ui';
import {
    Button,
    Container,
    MaterialContext,
    Panel,
    Row,
    Text,
} from '@wonderlandengine/react-ui/components';
import {ReactNode} from 'react';
import {UIState} from '../classes/UIState.js';
import {TileType} from '../classes/TileType.js';

const COLOR_SWATCHES = {
    CelestialBlue: '#4292CD',
    Maize: '#E4E04E',
    AppleGreen: '#ACAF30',
    NaplesYellow: '#FFE372',
    Chestnut: '#965744',
    Olive: '#7E8230',
    YinmnBlue: '#354E86',
    Silver: '#B5B9B9',
    PeachYellow: '#FFDFA3',
    DarkSpringGreen: '#247049',
};

const App = (props: {comp: MainMenu}) => {
    const comp = props.comp;
    const onClick = (tileToPlace: TileType) => {
        UIState.instance.tileToPlace = tileToPlace;
    };
    return (
        <MaterialContext.Provider value={comp}>
            <Container
                width="100%"
                height="100%"
                flexDirection={FlexDirection.ColumnReverse}
                justifyContent={Justify.FlexStart}
                alignItems={Align.Center}
            >
                <Panel
                    margin={25}
                    rounding={2}
                    width={500}
                    height={100}
                    backgroundColor={COLOR_SWATCHES.DarkSpringGreen}
                >
                    <Row gap={10}>
                        <Button
                            margin={10}
                            rounding={0}
                            backgroundColor={COLOR_SWATCHES.AppleGreen}
                            width={80}
                            height={80}
                            hovered={{
                                backgroundColor: COLOR_SWATCHES.CelestialBlue,
                            }}
                            active={{
                                backgroundColor: COLOR_SWATCHES.AppleGreen,
                            }}
                            justifyContent={Justify.Center}
                            onClick={() => onClick(TileType.Grass)}
                        >
                            <Text textAlign="center">A</Text>
                        </Button>
                        <Button
                            margin={10}
                            rounding={0}
                            backgroundColor={COLOR_SWATCHES.AppleGreen}
                            width={80}
                            height={80}
                            hovered={{
                                backgroundColor: COLOR_SWATCHES.CelestialBlue,
                            }}
                            active={{
                                backgroundColor: COLOR_SWATCHES.AppleGreen,
                            }}
                            justifyContent={Justify.Center}
                            onClick={() => onClick(TileType.Water)}
                        >
                            <Text textAlign="center">B</Text>
                        </Button>
                        <Button
                            margin={10}
                            rounding={0}
                            backgroundColor={COLOR_SWATCHES.AppleGreen}
                            width={80}
                            height={80}
                            hovered={{
                                backgroundColor: COLOR_SWATCHES.CelestialBlue,
                            }}
                            active={{
                                backgroundColor: COLOR_SWATCHES.AppleGreen,
                            }}
                            justifyContent={Justify.Center}
                            onClick={() => onClick(TileType.Road)}
                        >
                            <Text textAlign="center">C</Text>
                        </Button>
                    </Row>
                </Panel>
            </Container>
        </MaterialContext.Provider>
    );
};

export class MainMenu extends ReactUiBase {
    static TypeName = 'main-menu';
    static InheritProperties = true;

    render() {
        return <App comp={this} />;
    }
}
